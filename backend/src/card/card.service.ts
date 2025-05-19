import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnService } from 'src/column/column.service';
import { CardEntity, FullCardDTO } from 'src/entities/Card';
import { ColumnEntity } from 'src/entities/Column';
import { CommentEntity } from 'src/entities/Comment';
import { UserEntity } from 'src/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(CardEntity)
        private readonly cardRepository: Repository<CardEntity>,
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,

        private readonly columnService: ColumnService
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

    async add_comment(card: CardEntity, user: UserEntity, text: string): Promise<CommentEntity> {
        const comment =  this.commentRepository.create({card_id: card.id, author_id: user.id, content: text});
        return await this.commentRepository.save(comment);
    }

    async get_comments(card: CardEntity): Promise<CommentEntity[]> {
        return await this.commentRepository.find({ where: { card_id: card.id } })
    }

    async has_user(card: CardEntity, user: any): Promise<boolean> {
        const column = await this.columnService.get(card.column_id);
        if (!column) {
            return false;
        }
        return this.columnService.has_user(column, user);
    }
}
