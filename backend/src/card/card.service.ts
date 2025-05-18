import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity, FullCardDTO } from 'src/entities/Card';
import { ColumnEntity } from 'src/entities/Column';
import { Repository } from 'typeorm';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(CardEntity)
        private readonly cardRepository: Repository<CardEntity>,
    ) {}

    async get(id: string): Promise<CardEntity | null> {
        return this.cardRepository.findOne({ where: { id } });
    }

    async delete(card: CardEntity): Promise<void> {
        await this.cardRepository.remove(card);
    }

    async update_name(card: CardEntity, name: string): Promise<void> {
        card.name = name;
        await this.cardRepository.save(card);
    }

    async move(card: CardEntity, column: ColumnEntity): Promise<void> {
        card.column_id = column.id;
        await this.cardRepository.save(card);
    }

    get_full_card(card: CardEntity): FullCardDTO {
        return {
            id: card.id,
            name: card.name
        };
    }
}
