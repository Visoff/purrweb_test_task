import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Headers, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { FullCardDTO } from 'src/entities/Card';
import { CardService } from './card.service';
import { ColumnService } from 'src/column/column.service';
import { AuthGuard, AuthGuardCard } from 'src/auth/auth.guard';
import { CommentEntity } from 'src/entities/Comment';
import { UserService } from 'src/user/user.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('card')
export class CardController {
    constructor(
        private userService: UserService,
        private cardService: CardService,
        private columnService: ColumnService
    ) {}

    @Get(":id")
    @UseGuards(AuthGuard)
    @UseGuards(AuthGuardCard)
    @ApiOperation({ summary: "Get card by id" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: FullCardDTO })
    @ApiResponse({ status: 404, description: "Card not found" })
    async get(@Param('id', new ParseUUIDPipe()) id: string): Promise<FullCardDTO> {
        const card = await this.cardService.get(id);
        if (!card) {
            throw new HttpException("Card not found", HttpStatus.NOT_FOUND);
        }
        return this.cardService.get_full_card(card);
    }

    @Patch(":id/name")
    @UseGuards(AuthGuard)
    @UseGuards(AuthGuardCard)
    @ApiOperation({ summary: "Update card name" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: FullCardDTO })
    @ApiResponse({ status: 404, description: "Card not found" })
    @ApiResponse({ status: 400, description: "Name is required" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async update_name(@Param('id', new ParseUUIDPipe()) id: string, @Body("name") name: string): Promise<FullCardDTO> {
        const card = await this.cardService.get(id);
        if (!card) {
            throw new HttpException("Card not found", HttpStatus.NOT_FOUND);
        }
        await this.cardService.update_name(card, name);
        return this.cardService.get_full_card(card);
    }

    @Patch(":id/move")
    @UseGuards(AuthGuard)
    @UseGuards(AuthGuardCard)
    @ApiOperation({ summary: "Move card to another column" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: FullCardDTO })
    @ApiResponse({ status: 404, description: "Card or column not found" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 400, description: "Column id is required" })
    async move(@Param('id', new ParseUUIDPipe()) id: string, @Body("column_id", new ParseUUIDPipe()) column_id: string): Promise<FullCardDTO> {
        const card = await this.cardService.get(id);
        if (!card) {
            throw new HttpException("Card not found", HttpStatus.NOT_FOUND);
        }
        const column = await this.columnService.get(column_id);
        if (!column) {
            throw new HttpException("Column not found", HttpStatus.NOT_FOUND);
        }
        await this.cardService.move(card, column);
        return this.cardService.get_full_card(card);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    @UseGuards(AuthGuardCard)
    @ApiOperation({ summary: "Delete card" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: FullCardDTO })
    @ApiResponse({ status: 404, description: "Card not found" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        const card = await this.cardService.get(id);
        if (!card) {
            throw new HttpException("Card not found", HttpStatus.NOT_FOUND);
        }
        await this.cardService.delete(card);
    }

    @Get(":id/comments")
    @UseGuards(AuthGuard)
    @UseGuards(AuthGuardCard)
    @ApiOperation({ summary: "Get comments by card id" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: [CommentEntity] })
    @ApiResponse({ status: 404, description: "Card not found" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async get_comments(@Param('id', new ParseUUIDPipe()) id: string): Promise<CommentEntity[]> {
        const card = await this.cardService.get(id);
        if (!card) {
            throw new HttpException("Card not found", HttpStatus.NOT_FOUND);
        }
        return this.cardService.get_comments(card);
    }

    @Post(":id/comment")
    @UseGuards(AuthGuard)
    @UseGuards(AuthGuardCard)
    @ApiOperation({ summary: "Add comment to card" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: CommentEntity })
    @ApiResponse({ status: 404, description: "Card not found" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 400, description: "Content is required" })
    async add_comment(@Param('id', new ParseUUIDPipe()) id: string, @Headers("Authorization") token: string, @Body("content") content: string): Promise<any> {
        const user = await this.userService.from_bearer(token);
        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        const card = await this.cardService.get(id);
        if (!card) {
            throw new HttpException("Card not found", HttpStatus.NOT_FOUND);
        }
        return this.cardService.add_comment(card, user, content);
    }
}
