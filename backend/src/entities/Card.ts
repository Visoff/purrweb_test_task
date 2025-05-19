import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { ColumnEntity } from "./Column";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export class FullCardDTO {
    @IsString()
    @ApiProperty({ description: 'Card id' })
    id: string

    @IsString()
    @ApiProperty({ description: 'Card name' })
    name: string
}
