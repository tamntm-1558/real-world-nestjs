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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { ArticleQueryDto } from './dto/article-query.dto';
import { FeedQueryDto } from './dto/feed-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
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
    return await this.articleService.createArticle(createArticleDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({
    status: 200,
    description: 'Articles retrieved successfully',
    type: [ArticleResponseDto],
  })
  async findAll(
    @Query() query: ArticleQueryDto,
    @Request() req?: any,
  ): Promise<{ articles: ArticleResponseDto[]; articlesCount: number }> {
    const currentUserId = req?.user?.id;
    return await this.articleService.getAllArticles(query, currentUserId);
  }

  @Get('feed')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get articles feed from followed users' })
  @ApiResponse({
    status: 200,
    description: 'Feed retrieved successfully',
    type: [ArticleResponseDto],
  })
  async getFeed(
    @Query() query: FeedQueryDto,
    @Request() req?: any,
  ): Promise<{ articles: ArticleResponseDto[]; articlesCount: number }> {
    return await this.articleService.getArticleFeed(req.user.id, query);
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
    const currentUserId = req?.user?.id;
    return await this.articleService.getArticleBySlug(slug, currentUserId);
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
    return await this.articleService.updateArticle(slug, updateArticleDto, req.user.id);
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
    return await this.articleService.deleteArticle(slug, req.user.id);
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
    return await this.articleService.favoriteArticle(slug, req.user);
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
    return await this.articleService.unfavoriteArticle(slug, req.user);
  }
}
