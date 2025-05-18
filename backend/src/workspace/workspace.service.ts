import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/User";
import { FullWorkspaceDTO, WorkspaceEntity, WorkspaceUserEntity } from "src/entities/Workspace";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ColumnEntity, FullColumnDTO } from "src/entities/Column";
import { ColumnService } from "src/column/column.service";

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectRepository(WorkspaceEntity)
        private readonly workspaceRepository: Repository<WorkspaceEntity>,
        @InjectRepository(WorkspaceUserEntity)
        private readonly workspaceUserRepository: Repository<WorkspaceUserEntity>,
        @InjectRepository(ColumnEntity)
        private readonly columnRepository: Repository<ColumnEntity>,

        private readonly columnService: ColumnService,
    ) {}

    get_for_user(user: UserEntity): Promise<WorkspaceEntity[]> {
        return this.workspaceRepository.createQueryBuilder("workspace")
        .leftJoin(WorkspaceUserEntity, "wu", "workspace.id = wu.workspace_id")
        .where("wu.user_id = :id", { id: user.id })
        .getMany();
    }

    get (id: string): Promise<WorkspaceEntity | null> {
        return this.workspaceRepository.findOne({ where: { id } });
    }

    async update_name(workspace: WorkspaceEntity, name: string): Promise<void> {
        workspace.name = name;
        await this.workspaceRepository.save(workspace);
    }

    async delete(workspace: WorkspaceEntity): Promise<void> {
        await this.workspaceRepository.remove(workspace);
    }

    async has_user(workspace: WorkspaceEntity, user: UserEntity): Promise<boolean> {
        return (await this.workspaceUserRepository.findOne({
            where: { workspace_id: workspace.id, user_id: user.id },
        })) !== null;
    }
    async add_column(workspace: WorkspaceEntity, name: string): Promise<ColumnEntity> {
        if ( await this.columnRepository.findOne({ where: { name, workspace_id: workspace.id } })) {
            throw new HttpException("Column already exists", HttpStatus.CONFLICT);
        }
        const column = this.columnRepository.create({ name: name, workspace_id: workspace.id });
        return await this.columnRepository.save(column);
    }

    async get_full_workspace(workspace: WorkspaceEntity): Promise<FullWorkspaceDTO> {
        const columns: FullColumnDTO[] = [];
        const column_entities = await this.columnRepository.find({ where: { workspace_id: workspace.id } });
        for (const column of column_entities) {
            columns.push(await this.columnService.get_full_column(column));
        }
        return {
            id: workspace.id,
            name: workspace.name,
            columns: columns
        }
    }

    async create(name: string): Promise<WorkspaceEntity> {
        const workspace = this.workspaceRepository.create({ name });
        return await this.workspaceRepository.save(workspace);
    }

    async add_user(
        workspace: WorkspaceEntity,
        user: UserEntity,
    ): Promise<WorkspaceUserEntity> {
        if (
            await this.workspaceUserRepository.findOne({
                where: { workspace_id: workspace.id, user_id: user.id },
            })
        ) {
            throw new HttpException("User already in workspace", HttpStatus.CONFLICT);
        }
        const workspace_user = this.workspaceUserRepository.create({
            workspace_id: workspace.id,
            user_id: user.id,
        });
        return await this.workspaceUserRepository.save(workspace_user);
    }
}
