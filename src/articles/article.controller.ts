import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { I18nService } from 'nestjs-i18n';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({
    status: 201,
    description: 'Article created successfully',
    type: ArticleResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req,
  ): Promise<{ article: ArticleResponseDto }> {
    const article = await this.articleService.create(createArticleDto, req.user);
    return {
      article: new ArticleResponseDto(article, req.user.id),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiQuery({ name: 'tag', required: false, description: 'Filter by tag' })
  @ApiQuery({ name: 'author', required: false, description: 'Filter by author username' })
  @ApiQuery({ name: 'favorited', required: false, description: 'Filter by favorited username' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of articles' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({
    status: 200,
    description: 'Articles retrieved successfully',
    type: [ArticleResponseDto],
  })
  async findAll(
    @Query('tag') tag?: string,
    @Query('author') author?: string,
    @Query('favorited') favorited?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Request() req?: any,
  ): Promise<{ articles: ArticleResponseDto[]; articlesCount: number }> {
    const { articles, articlesCount } = await this.articleService.findAll({
      tag,
      author,
      favorited,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });

    const currentUserId = req?.user?.id;

    return {
      articles: articles.map((article) => new ArticleResponseDto(article, currentUserId)),
      articlesCount,
    };
  }

  @Get('feed')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get articles feed from followed users' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Feed retrieved successfully',
    type: [ArticleResponseDto],
  })
  async getFeed(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Request() req?: any,
  ): Promise<{ articles: ArticleResponseDto[]; articlesCount: number }> {
    const { articles, articlesCount } = await this.articleService.getFeed(
      req.user.id,
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined,
    );

    return {
      articles: articles.map((article) => new ArticleResponseDto(article, req.user.id)),
      articlesCount,
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get article by slug' })
  @ApiResponse({
    status: 200,
    description: 'Article retrieved successfully',
    type: ArticleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async findOne(
    @Param('slug') slug: string,
    @Request() req?: any,
  ): Promise<{ article: ArticleResponseDto }> {
    const article = await this.articleService.findBySlug(slug);

    if (!article) {
      const message = await this.i18n.translate('articles.errors.not_found');
      throw new NotFoundException(message);
    }

    const currentUserId = req?.user?.id;

    return {
      article: new ArticleResponseDto(article, currentUserId),
    };
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({
    status: 200,
    description: 'Article updated successfully',
    type: ArticleResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the author' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async update(
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req,
  ): Promise<{ article: ArticleResponseDto }> {
    const article = await this.articleService.update(slug, updateArticleDto, req.user.id);

    if (!article) {
      const existingArticle = await this.articleService.findBySlug(slug);
      
      if (!existingArticle) {
        const message = await this.i18n.translate('articles.errors.not_found');
        throw new NotFoundException(message);
      }

      const message = await this.i18n.translate('articles.errors.not_author');
      throw new ForbiddenException(message);
    }

    return {
      article: new ArticleResponseDto(article, req.user.id),
    };
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 204, description: 'Article deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the author' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async delete(@Param('slug') slug: string, @Request() req): Promise<void> {
    const deleted = await this.articleService.delete(slug, req.user.id);

    if (!deleted) {
      const existingArticle = await this.articleService.findBySlug(slug);
      
      if (!existingArticle) {
        const message = await this.i18n.translate('articles.errors.not_found');
        throw new NotFoundException(message);
      }

      const message = await this.i18n.translate('articles.errors.not_author');
      throw new ForbiddenException(message);
    }
  }

  @Post(':slug/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Favorite an article' })
  @ApiResponse({
    status: 200,
    description: 'Article favorited successfully',
    type: ArticleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async favorite(
    @Param('slug') slug: string,
    @Request() req,
  ): Promise<{ article: ArticleResponseDto }> {
    const article = await this.articleService.favorite(slug, req.user);

    if (!article) {
      const message = await this.i18n.translate('articles.errors.not_found');
      throw new NotFoundException(message);
    }

    return {
      article: new ArticleResponseDto(article, req.user.id),
    };
  }

  @Delete(':slug/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfavorite an article' })
  @ApiResponse({
    status: 200,
    description: 'Article unfavorited successfully',
    type: ArticleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async unfavorite(
    @Param('slug') slug: string,
    @Request() req,
  ): Promise<{ article: ArticleResponseDto }> {
    const article = await this.articleService.unfavorite(slug, req.user);

    if (!article) {
      const message = await this.i18n.translate('articles.errors.not_found');
      throw new NotFoundException(message);
    }

    return {
      article: new ArticleResponseDto(article, req.user.id),
    };
  }
}
