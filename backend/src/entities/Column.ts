import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { WorkspaceEntity } from "./Workspace";
import { IsNotEmpty, IsString } from "class-validator";
import { FullCardDTO } from "./Card";

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
}

export class FullColumnDTO {
    @IsString()
    id: string

    @IsString()
    name: string

    @IsNotEmpty()
    cards: FullCardDTO[]
}
