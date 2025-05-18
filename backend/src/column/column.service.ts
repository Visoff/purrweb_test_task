import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardService } from 'src/card/card.service';
import { CardEntity, FullCardDTO } from 'src/entities/Card';
import { ColumnEntity, FullColumnDTO } from 'src/entities/Column';
import { Repository } from 'typeorm';

@Injectable()
export class ColumnService {
    constructor(
        @InjectRepository(ColumnEntity)
        private readonly columnRepository: Repository<ColumnEntity>,
        @InjectRepository(CardEntity)
        private readonly CardRepository: Repository<CardEntity>,

        private readonly cardService: CardService
    ) {}

    async get(id: string): Promise<ColumnEntity | null> {
        return this.columnRepository.findOne({ where: { id } });
    }

    async update_name(column: ColumnEntity, name: string): Promise<void> {
        column.name = name;
        await this.columnRepository.save(column);
    }

    async delete(column: ColumnEntity): Promise<void> {
        await this.columnRepository.remove(column);
    }

    async add_card(column: ColumnEntity, name: string): Promise<CardEntity> {
        const card = this.CardRepository.create({ name: name, column_id: column.id });
        await this.CardRepository.save(card);
        return card;
    }

    async get_full_column(column: ColumnEntity): Promise<FullColumnDTO> {
        const cards: FullCardDTO[] = [];
        const card_entities = await this.CardRepository.find({ where: { column_id: column.id } });
        for (const card of card_entities) {
            cards.push(this.cardService.get_full_card(card));
        }
        return {
            id: column.id,
            name: column.name,
            cards: cards
        }
    }
}
