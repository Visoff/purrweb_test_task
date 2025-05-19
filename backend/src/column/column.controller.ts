import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ColumnService } from './column.service';
import { FullCardDTO } from 'src/entities/Card';
import { CardService } from 'src/card/card.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('column')
export class ColumnController {
    constructor(
        private columnService: ColumnService,
        private cardService: CardService
    ) {}

    @Get(':id')
    @ApiOperation({ summary: 'Get column by id' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, type: FullCardDTO })
    @ApiResponse({ status: 404, description: 'Column not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async get(@Param('id', new ParseUUIDPipe()) id: string): Promise<FullCardDTO> {
        const column = await this.columnService.get(id);
        if (!column) {
            throw new HttpException("Column not found", HttpStatus.NOT_FOUND);
        }
        return await this.columnService.get_full_column(column);
    }

    @Post(':id/card')
    @ApiOperation({ summary: 'Add card to column' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, type: FullCardDTO })
    @ApiResponse({ status: 404, description: 'Column not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async add_card(@Param('id', new ParseUUIDPipe()) id: string, @Body("name") name: string): Promise<FullCardDTO> {
        const column = await this.columnService.get(id);
        if (!column) {
            throw new HttpException("Column not found", HttpStatus.NOT_FOUND);
        }
        const card = await this.columnService.add_card(column, name);
        return this.cardService.get_full_card(card);
    }

    @Patch(':id/name')
    @ApiOperation({ summary: 'Update column name' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, type: FullCardDTO })
    @ApiResponse({ status: 404, description: 'Column not found' })
    async update_name(@Param('id', new ParseUUIDPipe()) id: string, @Body("name") name: string): Promise<FullCardDTO> {
        const column = await this.columnService.get(id);
        if (!column) {
            throw new HttpException("Column not found", HttpStatus.NOT_FOUND);
        }
        await this.columnService.update_name(column, name);
        return await this.columnService.get_full_column(column);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete column' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, type: FullCardDTO })
    @ApiResponse({ status: 404, description: 'Column not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        const column = await this.columnService.get(id);
        if (!column) {
            throw new HttpException("Column not found", HttpStatus.NOT_FOUND);
        }
        await this.columnService.delete(column);
    }
}
