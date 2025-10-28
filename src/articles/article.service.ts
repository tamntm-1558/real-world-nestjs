import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
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
      queryBuilder.andWhere(':tag = ANY(article.tagList)', { tag: query.tag });
    }

    if (query?.author) {
      queryBuilder.andWhere('author.username = :author', { author: query.author });
    }

    if (query?.favorited) {
      queryBuilder.andWhere('favoritedBy.username = :favorited', { favorited: query.favorited });
    }

    const limit = query?.limit || 20;
    const offset = query?.offset || 0;

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
    limit: number = 20,
    offset: number = 0,
  ): Promise<{ articles: Article[]; articlesCount: number }> {
    // This would require a Follow entity and relationship
    // For now, return empty array
    return { articles: [], articlesCount: 0 };
  }
}
