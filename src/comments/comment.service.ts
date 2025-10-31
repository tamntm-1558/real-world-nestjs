import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentQueryDto } from './dto/comment-query.dto';
import { User } from '../users/user.entity';
import { ArticleService } from '../articles/article.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private articleService: ArticleService,
    private i18n: I18nService,
  ) {}

  /**
   * Create a new comment on an article
   * @param articleSlug - Article slug
   * @param createCommentDto - Comment data
   * @param user - Author user
   * @returns Comment response
   */
  async createComment(
    articleSlug: string,
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<{ comment: CommentResponseDto }> {
    // Find article
    const article = await this.articleService.findBySlug(articleSlug);

    if (!article) {
      const message = await this.i18n.translate('articles.article_not_found');
      throw new NotFoundException(message);
    }

    // Create comment
    const comment = this.commentRepository.create({
      body: createCommentDto.body,
      article,
      articleId: article.id,
      author: user,
      authorId: user.id,
    });

    const savedComment = await this.commentRepository.save(comment);

    return {
      comment: new CommentResponseDto(savedComment),
    };
  }

  /**
   * Get all comments for an article
   * @param articleSlug - Article slug
   * @param query - Query parameters
   * @returns Comments response
   */
  async getArticleComments(
    articleSlug: string,
    query: CommentQueryDto,
  ): Promise<{ comments: CommentResponseDto[]; commentsCount: number }> {
    // Find article
    const article = await this.articleService.findBySlug(articleSlug);

    if (!article) {
      const message = await this.i18n.translate('articles.article_not_found');
      throw new NotFoundException(message);
    }

    // Build query
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.articleId = :articleId', { articleId: article.id })
      .orderBy('comment.createdAt', 'DESC')
      .take(query.limit)
      .skip(query.offset);

    const [comments, commentsCount] = await queryBuilder.getManyAndCount();

    return {
      comments: comments.map((comment) => new CommentResponseDto(comment)),
      commentsCount,
    };
  }

  /**
   * Delete a comment
   * @param articleSlug - Article slug
   * @param commentId - Comment ID
   * @param userId - Current user ID
   * @returns void
   */
  async deleteComment(
    articleSlug: string,
    commentId: number,
    userId: number,
  ): Promise<void> {
    // Find article
    const article = await this.articleService.findBySlug(articleSlug);

    if (!article) {
      const message = await this.i18n.translate('articles.article_not_found');
      throw new NotFoundException(message);
    }

    // Find comment
    const comment = await this.commentRepository.findOne({
      where: { 
        id: commentId,
        articleId: article.id,
      },
      relations: ['author'],
    });

    if (!comment) {
      const message = await this.i18n.translate('comments.comment_not_found');
      throw new NotFoundException(message);
    }

    // Check if user is the author
    if (comment.author.id !== userId) {
      const message = await this.i18n.translate('comments.unauthorized_delete');
      throw new ForbiddenException(message);
    }

    await this.commentRepository.remove(comment);
  }
}
