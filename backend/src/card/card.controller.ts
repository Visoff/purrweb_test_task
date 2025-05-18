import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { FullCardDTO } from 'src/entities/Card';
import { CardService } from './card.service';
import { ColumnService } from 'src/column/column.service';

@Controller('card')
export class CardController {
    constructor(
        private cardService: CardService,
        private columnService: ColumnService
    ) {}

    @Get(":id")
    async get(@Param('id', new ParseUUIDPipe()) id: string): Promise<FullCardDTO> {
        const card = await this.cardService.get(id);
        if (!card) {
            throw new HttpException("Card not found", HttpStatus.NOT_FOUND);
        }
        return this.cardService.get_full_card(card);
    }

    @Patch(":id/name")
    async update_name(@Param('id', new ParseUUIDPipe()) id: string, @Body("name") name: string): Promise<FullCardDTO> {
        const card = await this.cardService.get(id);
        if (!card) {
            throw new HttpException("Card not found", HttpStatus.NOT_FOUND);
        }
        await this.cardService.update_name(card, name);
        return this.cardService.get_full_card(card);
    }

    @Patch(":id/move")
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
    async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        const card = await this.cardService.get(id);
        if (!card) {
            throw new HttpException("Card not found", HttpStatus.NOT_FOUND);
        }
        await this.cardService.delete(card);
    }
}
