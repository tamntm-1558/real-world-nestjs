import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentQueryDto } from './dto/comment-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Comments')
@Controller('articles/:slug/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment on an article' })
  @ApiParam({ name: 'slug', description: 'Article slug' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async create(
    @Param('slug') articleSlug: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ): Promise<{ comment: CommentResponseDto }> {
    return await this.commentService.createComment(
      articleSlug,
      createCommentDto,
      req.user,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for an article' })
  @ApiParam({ name: 'slug', description: 'Article slug' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: [CommentResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async findAll(
    @Param('slug') articleSlug: string,
    @Query() query: CommentQueryDto,
  ): Promise<{ comments: CommentResponseDto[]; commentsCount: number }> {
    return await this.commentService.getArticleComments(articleSlug, query);
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'slug', description: 'Article slug' })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiResponse({ status: 204, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the author' })
  @ApiResponse({ status: 404, description: 'Article or comment not found' })
  async delete(
    @Param('slug') articleSlug: string,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Request() req,
  ): Promise<void> {
    return await this.commentService.deleteComment(
      articleSlug,
      commentId,
      req.user.id,
    );
  }
}
