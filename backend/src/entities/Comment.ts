import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./User";
import { CardEntity } from "./Card";

@Entity()
export class CommentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column("text")
    content: string

    @Column("uuid")
    @ManyToOne(() => UserEntity, user => user.id, { cascade: true })
    author_id: string

    @Column("uuid")
    @ManyToOne(() => CardEntity, card => card.id, { cascade: true })
    card_id: string

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
