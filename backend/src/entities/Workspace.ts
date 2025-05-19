import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './User';
import { IsNotEmpty, IsString } from 'class-validator';
import { FullColumnDTO } from './Column';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class WorkspaceEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ description: 'Workspace id' })
    id: string;

    @Column()
    @ApiProperty({ description: 'Workspace name' })
    name: string;

    @CreateDateColumn()
    @ApiProperty({ description: 'Workspace creation date' })
    created_at: Date;

    @UpdateDateColumn()
    @ApiProperty({ description: 'Workspace update date' })
    updated_at: Date;
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
    @ApiProperty({ description: 'Workspace id' })
    id: string;

    @IsString()
    @ApiProperty({ description: 'Workspace name' })
    name: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'Workspace columns', type: [FullColumnDTO] })
    columns: FullColumnDTO[]
}
