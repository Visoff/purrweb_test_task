import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ColumnService } from './column.service';
import { FullCardDTO } from 'src/entities/Card';
import { CardService } from 'src/card/card.service';

@Controller('column')
export class ColumnController {
    constructor(
        private columnService: ColumnService,
        private cardService: CardService
    ) {}

    @Get(':id')
    async get(@Param('id', new ParseUUIDPipe()) id: string): Promise<FullCardDTO> {
        const column = await this.columnService.get(id);
        if (!column) {
            throw new HttpException("Column not found", HttpStatus.NOT_FOUND);
        }
        return await this.columnService.get_full_column(column);
    }

    @Post(':id/card')
    async add_card(@Param('id', new ParseUUIDPipe()) id: string, @Body("name") name: string): Promise<FullCardDTO> {
        const column = await this.columnService.get(id);
        if (!column) {
            throw new HttpException("Column not found", HttpStatus.NOT_FOUND);
        }
        const card = await this.columnService.add_card(column, name);
        return this.cardService.get_full_card(card);
    }

    @Patch(':id/name')
    async update_name(@Param('id', new ParseUUIDPipe()) id: string, @Body("name") name: string): Promise<FullCardDTO> {
        const column = await this.columnService.get(id);
        if (!column) {
            throw new HttpException("Column not found", HttpStatus.NOT_FOUND);
        }
        await this.columnService.update_name(column, name);
        return await this.columnService.get_full_column(column);
    }

    @Delete(':id')
    async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        const column = await this.columnService.get(id);
        if (!column) {
            throw new HttpException("Column not found", HttpStatus.NOT_FOUND);
        }
        await this.columnService.delete(column);
    }
}
