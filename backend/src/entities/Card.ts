import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ColumnEntity } from "./Column";
import { IsString } from "class-validator";

@Entity()
@Unique(['column_id', 'name'])
export class CardEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column("uuid")
    @ManyToOne(() => ColumnEntity, column => column.id)
    column_id: string;
}

export class FullCardDTO {
    @IsString()
    id: string
    @IsString()
    name: string
}
