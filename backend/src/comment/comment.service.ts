import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/Comment';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
    ) {}

    async delete(comment: CommentEntity): Promise<void> {
        await this.commentRepository.remove(comment);
    }

    async get(id: string): Promise<CommentEntity | null> {
        return this.commentRepository.findOne({ where: { id } });
    }
}
