import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { WorkspaceEntity } from "./Workspace";
import { IsNotEmpty, IsString } from "class-validator";
import { FullCardDTO } from "./Card";
import { ApiProperty } from "@nestjs/swagger";

@Unique(['workspace_id', 'name'])
@Entity()
export class ColumnEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column("uuid")
    @ManyToOne(() => WorkspaceEntity, workspace => workspace.id)
    workspace_id: string

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export class FullColumnDTO {
    @IsString()
    @ApiProperty({ description: 'Column id' })
    id: string

    @IsString()
    @ApiProperty({ description: 'Column name' })
    name: string

    @IsNotEmpty()
    @ApiProperty({ description: 'Column cards', type: [FullCardDTO] })
    cards: FullCardDTO[]
}
