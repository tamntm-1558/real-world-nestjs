import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { ArticleQueryDto } from './dto/article-query.dto';
import { FeedQueryDto } from './dto/feed-query.dto';
import { User } from '../users/user.entity';
import { I18nService } from 'nestjs-i18n';
import { PAGINATION } from 'src/config/constant';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private i18n: I18nService,
  ) {}

  /**
   * Generate slug from title
   * @param title - Article title
   * @returns Slugified title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Ensure slug is unique by adding suffix if needed
   * @param baseSlug - Base slug
   * @returns Unique slug
   */
  private async ensureUniqueSlug(baseSlug: string, excludeId?: number): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const query = this.articleRepository
        .createQueryBuilder('article')
        .where('article.slug = :slug', { slug });

      if (excludeId) {
        query.andWhere('article.id != :excludeId', { excludeId });
      }

      const existing = await query.getOne();

      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Create a new article
   * @param createArticleDto - Article data
   * @param author - Author user
   * @returns Created article
   */
  async create(createArticleDto: CreateArticleDto, author: User): Promise<Article> {
    const baseSlug = this.generateSlug(createArticleDto.title);
    const slug = await this.ensureUniqueSlug(baseSlug);

    const article = this.articleRepository.create({
      ...createArticleDto,
      slug,
      author,
      tagList: createArticleDto.tagList || [],
    });

    return await this.articleRepository.save(article);
  }

  /**
   * Find all articles with optional filters
   * @param query - Query parameters
   * @returns Array of articles
   */
  async findAll(query?: {
    tag?: string;
    author?: string;
    favorited?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ articles: Article[]; articlesCount: number }> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.favoritedBy', 'favoritedBy')
      .orderBy('article.createdAt', 'DESC');

    if (query?.tag) {
      queryBuilder.andWhere('article.tagList = :tag', { tag: query.tag });
    }

    if (query?.author) {
      queryBuilder.andWhere('author.username = :author', { author: query.author });
    }

    if (query?.favorited) {
      queryBuilder.andWhere('favoritedBy.username = :favorited', { favorited: query.favorited });
    }

    const limit = query?.limit || PAGINATION.DEFAULT_LIMIT;
    const offset = query?.offset || PAGINATION.DEFAULT_OFFSET;

    queryBuilder.take(limit).skip(offset);

    const [articles, articlesCount] = await queryBuilder.getManyAndCount();

    return { articles, articlesCount };
  }

  /**
   * Find article by slug
   * @param slug - Article slug
   * @returns Article or null
   */
  async findBySlug(slug: string): Promise<Article | null> {
    return await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'favoritedBy'],
    });
  }

  /**
   * Find article by ID
   * @param id - Article ID
   * @returns Article or null
   */
  async findById(id: number): Promise<Article | null> {
    return await this.articleRepository.findOne({
      where: { id },
      relations: ['author', 'favoritedBy'],
    });
  }

  /**
   * Update article
   * @param slug - Article slug
   * @param updateArticleDto - Update data
   * @param userId - Current user ID
   * @returns Updated article or null
   */
  async update(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    userId: number,
  ): Promise<Article | null> {
    const article = await this.findBySlug(slug);

    if (!article || article.author.id !== userId) {
      return null;
    }

    // If title is updated, regenerate slug
    if (updateArticleDto.title && updateArticleDto.title !== article.title) {
      const baseSlug = this.generateSlug(updateArticleDto.title);
      const newSlug = await this.ensureUniqueSlug(baseSlug, article.id);
      article.slug = newSlug;
    }

    Object.assign(article, updateArticleDto);

    return await this.articleRepository.save(article);
  }

  /**
   * Delete article
   * @param slug - Article slug
   * @param userId - Current user ID
   * @returns True if deleted, false otherwise
   */
  async delete(slug: string, userId: number): Promise<boolean> {
    const article = await this.findBySlug(slug);

    if (!article || article.author.id !== userId) {
      return false;
    }

    await this.articleRepository.remove(article);
    return true;
  }

  /**
   * Favorite article
   * @param slug - Article slug
   * @param user - User who favorites
   * @returns Updated article or null
   */
  async favorite(slug: string, user: User): Promise<Article | null> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'favoritedBy'],
    });

    if (!article) {
      return null;
    }

    const alreadyFavorited = article.favoritedBy.some((u) => u.id === user.id);

    if (!alreadyFavorited) {
      article.favoritedBy.push(user);
      article.favoritesCount++;
      await this.articleRepository.save(article);
    }

    return article;
  }

  /**
   * Unfavorite article
   * @param slug - Article slug
   * @param user - User who unfavorites
   * @returns Updated article or null
   */
  async unfavorite(slug: string, user: User): Promise<Article | null> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'favoritedBy'],
    });

    if (!article) {
      return null;
    }

    article.favoritedBy = article.favoritedBy.filter((u) => u.id !== user.id);
    article.favoritesCount = Math.max(0, article.favoritesCount - 1);

    await this.articleRepository.save(article);

    return article;
  }

  /**
   * Get feed for user (articles from followed users)
   * @param userId - Current user ID
   * @param limit - Number of articles
   * @param offset - Offset for pagination
   * @returns Array of articles
   */
  async getFeed(
    userId: number,
    limit: number = PAGINATION.DEFAULT_LIMIT,
    offset: number = PAGINATION.DEFAULT_OFFSET,
  ): Promise<{ articles: Article[]; articlesCount: number }> {
    // This would require a Follow entity and relationship
    // For now, return empty array
    return { articles: [], articlesCount: 0 };
  }

  /**
   * Create article with business logic and error handling
   * @param createArticleDto - Article data
   * @param user - Author user
   * @returns Article response
   */
  async createArticle(createArticleDto: CreateArticleDto, user: User): Promise<{ article: ArticleResponseDto }> {
    const article = await this.create(createArticleDto, user);
    return {
      article: new ArticleResponseDto(article, user.id),
    };
  }

  /**
   * Get all articles with business logic
   * @param query - Query parameters
   * @param currentUserId - Current user ID (optional)
   * @returns Articles response
   */
  async getAllArticles(
    query: ArticleQueryDto,
    currentUserId?: number,
  ): Promise<{ articles: ArticleResponseDto[]; articlesCount: number }> {
    const { articles, articlesCount } = await this.findAll(query);

    return {
      articles: articles.map((article) => new ArticleResponseDto(article, currentUserId)),
      articlesCount,
    };
  }

  /**
   * Get article feed with business logic
   * @param userId - Current user ID
   * @param query - Query parameters
   * @returns Feed response
   */
  async getArticleFeed(
    userId: number,
    query: FeedQueryDto,
  ): Promise<{ articles: ArticleResponseDto[]; articlesCount: number }> {
    const { articles, articlesCount } = await this.getFeed(userId, query.limit, query.offset);

    return {
      articles: articles.map((article) => new ArticleResponseDto(article, userId)),
      articlesCount,
    };
  }

  /**
   * Get single article with business logic and error handling
   * @param slug - Article slug
   * @param currentUserId - Current user ID (optional)
   * @returns Article response
   */
  async getArticleBySlug(slug: string, currentUserId?: number): Promise<{ article: ArticleResponseDto }> {
    const article = await this.findBySlug(slug);

    if (!article) {
      const message = await this.i18n.translate('articles.article_not_found');
      throw new NotFoundException(message);
    }

    return {
      article: new ArticleResponseDto(article, currentUserId),
    };
  }

  /**
   * Update article with business logic and error handling
   * @param slug - Article slug
   * @param updateArticleDto - Update data
   * @param userId - Current user ID
   * @returns Updated article response
   */
  async updateArticle(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    userId: number,
  ): Promise<{ article: ArticleResponseDto }> {
    const article = await this.update(slug, updateArticleDto, userId);

    if (!article) {
      const existingArticle = await this.findBySlug(slug);
      
      if (!existingArticle) {
        const message = await this.i18n.translate('articles.article_not_found');
        throw new NotFoundException(message);
      }

      const message = await this.i18n.translate('articles.unauthorized_update');
      throw new ForbiddenException(message);
    }

    return {
      article: new ArticleResponseDto(article, userId),
    };
  }

  /**
   * Delete article with business logic and error handling
   * @param slug - Article slug
   * @param userId - Current user ID
   * @returns void
   */
  async deleteArticle(slug: string, userId: number): Promise<void> {
    const deleted = await this.delete(slug, userId);

    if (!deleted) {
      const existingArticle = await this.findBySlug(slug);
      
      if (!existingArticle) {
        const message = await this.i18n.translate('articles.article_not_found');
        throw new NotFoundException(message);
      }

      const message = await this.i18n.translate('articles.unauthorized_delete');
      throw new ForbiddenException(message);
    }
  }

  /**
   * Favorite article with business logic and error handling
   * @param slug - Article slug
   * @param user - User who favorites
   * @returns Article response
   */
  async favoriteArticle(slug: string, user: User): Promise<{ article: ArticleResponseDto }> {
    const article = await this.favorite(slug, user);

    if (!article) {
      const message = await this.i18n.translate('articles.article_not_found');
      throw new NotFoundException(message);
    }

    return {
      article: new ArticleResponseDto(article, user.id),
    };
  }

  /**
   * Unfavorite article with business logic and error handling
   * @param slug - Article slug
   * @param user - User who unfavorites
   * @returns Article response
   */
  async unfavoriteArticle(slug: string, user: User): Promise<{ article: ArticleResponseDto }> {
    const article = await this.unfavorite(slug, user);

    if (!article) {
      const message = await this.i18n.translate('articles.article_not_found');
      throw new NotFoundException(message);
    }

    return {
      article: new ArticleResponseDto(article, user.id),
    };
  }
}
