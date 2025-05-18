import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from './User';
import { IsNotEmpty, IsString } from 'class-validator';
import { FullColumnDTO } from './Column';

@Entity()
export class WorkspaceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
}

@Entity()
@Unique(['workspace_id', 'user_id'])
export class WorkspaceUserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("uuid")
    @ManyToOne(() => WorkspaceEntity, workspace => workspace.id, { cascade: true })
    workspace_id: string;

    @Column("uuid")
    @ManyToOne(() => UserEntity, user => user.id, { cascade: true })
    user_id: string;
}

export class FullWorkspaceDTO {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsNotEmpty()
    columns: FullColumnDTO[]
}
