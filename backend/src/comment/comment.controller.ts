import { Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentEntity } from 'src/entities/Comment';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard, AuthGuardComment } from 'src/auth/auth.guard';

@Controller('comment')
export class CommentController {
    constructor(
        private commentService: CommentService
    ) {}

    @Get(":id")
    @UseGuards(AuthGuard)
    @UseGuards(AuthGuardComment)
    @ApiOperation({ summary: "Get comment by id" })
    @ApiParam({ name: "id", type: String })
    @ApiResponse({ status: 200, type: CommentEntity })
    @ApiResponse({ status: 404, description: "Comment not found" })
    @ApiResponse({ status: 500, description: "Internal server error" })
    async get(@Param('id', new ParseUUIDPipe()) id: string): Promise<CommentEntity | null> {
        return this.commentService.get(id);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    @UseGuards(AuthGuardComment)
    @ApiOperation({ summary: "Delete comment by id" })
    @ApiParam({ name: "id", type: String })
    @ApiResponse({ status: 200, description: "Comment deleted" })
    @ApiResponse({ status: 404, description: "Comment not found" })
    async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        const comment = await this.commentService.get(id);
        if (!comment) {
            throw new HttpException("Comment not found", HttpStatus.NOT_FOUND);
        }
        await this.commentService.delete(comment);
    }
}
