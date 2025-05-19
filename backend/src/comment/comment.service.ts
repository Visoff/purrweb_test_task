import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardService } from 'src/card/card.service';
import { CommentEntity } from 'src/entities/Comment';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,

        private readonly cardService: CardService
    ) {}

    async delete(comment: CommentEntity): Promise<void> {
        await this.commentRepository.remove(comment);
    }

    async get(id: string): Promise<CommentEntity | null> {
        return this.commentRepository.findOne({ where: { id } });
    }

    async has_user(comment: CommentEntity, user: any): Promise<boolean> {
        const card = await this.cardService.get(comment.card_id);
        if (!card) {
            return false;
        }
        return this.cardService.has_user(card, user);
    }
}
