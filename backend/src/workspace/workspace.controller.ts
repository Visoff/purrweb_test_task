import {
    Body,
    Controller,
    Post,
    Headers,
    HttpException,
    HttpStatus,
    UseGuards,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Delete,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { WorkspaceService } from "./workspace.service";
import { AuthGuard } from "src/auth/auth.guard";
import { FullWorkspaceDTO, WorkspaceEntity } from "../entities/Workspace";
import { FullColumnDTO } from "src/entities/Column";
import { ColumnService } from "src/column/column.service";
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

@Controller("workspace")
export class WorkspaceController {
    constructor(
        private workspaceService: WorkspaceService,
        private userService: UserService,
        private columnService: ColumnService
    ) {}

    @Get(":id")
    @ApiOperation({ summary: "Get workspace by id" })
    @ApiHeader({ name: "Authorization", required: true })
    @ApiParam({ name: "id", required: true })
    @ApiResponse({ status: 200, type: FullWorkspaceDTO })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Workspace not found" })
    @UseGuards(AuthGuard)
    async get(
        @Headers("Authorization") bearer: string,
        @Param("id", new ParseUUIDPipe()) id: string,
    ): Promise<FullWorkspaceDTO> {
        const workspace = await this.workspaceService.get(id);
        if (!workspace) {
            throw new HttpException("Workspace not found", HttpStatus.NOT_FOUND);
        }
        const user = await this.userService.from_bearer(bearer);
        if (!user) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        if (!await this.workspaceService.has_user(workspace, user)) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        return await this.workspaceService.get_full_workspace(workspace);
    }

    @Patch(":id/name")
    @ApiOperation({ summary: "Update workspace name" })
    @ApiHeader({ name: "Authorization", required: true })
    @ApiParam({ name: "id", required: true })
    @ApiResponse({ status: 200, type: FullWorkspaceDTO })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Workspace not found" })
    @ApiResponse({ status: 400, description: "Name is required" })
    @UseGuards(AuthGuard)
    async update_name(
        @Headers("Authorization") bearer: string,
        @Body("name") name: string,
        @Param("id", new ParseUUIDPipe()) id: string,
    ): Promise<FullWorkspaceDTO> {
        if (!name) {
            throw new HttpException("Name is required", HttpStatus.BAD_REQUEST);
        }
        const workspace = await this.workspaceService.get(id);
        if (!workspace) {
            throw new HttpException("Workspace not found", HttpStatus.NOT_FOUND);
        }
        const user = await this.userService.from_bearer(bearer);
        if (!user) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        if (!await this.workspaceService.has_user(workspace, user)) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        await this.workspaceService.update_name(workspace, name);
        return await this.workspaceService.get_full_workspace(workspace);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete workspace" })
    @ApiHeader({ name: "Authorization", required: true })
    @ApiParam({ name: "id", required: true })
    @ApiResponse({ status: 200, description: "OK" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Workspace not found" })
    @UseGuards(AuthGuard)
    async delete(
        @Headers("Authorization") bearer: string,
        @Param("id", new ParseUUIDPipe()) id: string,
    ): Promise<"OK"> {
        const workspace = await this.workspaceService.get(id);
        if (!workspace) {
            throw new HttpException("Workspace not found", HttpStatus.NOT_FOUND);
        }
        const user = await this.userService.from_bearer(bearer);
        if (!user) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        if (!await this.workspaceService.has_user(workspace, user)) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        await this.workspaceService.delete(workspace);
        return "OK"
    }

    @Post(":id/column")
    @ApiOperation({ summary: "Add column to workspace" })
    @ApiHeader({ name: "Authorization", required: true })
    @ApiParam({ name: "id", required: true })
    @ApiResponse({ status: 200, type: FullColumnDTO })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Workspace not found" })
    @ApiResponse({ status: 400, description: "Name is required" })
    @UseGuards(AuthGuard)
    async add_column(
        @Headers("Authorization") bearer: string,
        @Body("name") name: string,
        @Param("id", new ParseUUIDPipe()) id: string,
    ): Promise<FullColumnDTO> {
        if (!name) {
            throw new HttpException("Name is required", HttpStatus.BAD_REQUEST);
        }
        const workspace = await this.workspaceService.get(id);
        if (!workspace) {
            throw new HttpException("Workspace not found", HttpStatus.NOT_FOUND);
        }
        const user = await this.userService.from_bearer(bearer);
        if (!user) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        if (!await this.workspaceService.has_user(workspace, user)) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        const column = await this.workspaceService.add_column(workspace, name);
        return await this.columnService.get_full_column(column);
    }

    @Get()
    @ApiOperation({ summary: "List workspaces" })
    @ApiHeader({ name: "Authorization", required: true })
    @ApiResponse({ status: 200, type: [WorkspaceEntity] })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @UseGuards(AuthGuard)
    async list(
        @Headers("Authorization") bearer: string,
    ): Promise<WorkspaceEntity[]> {
        const user = await this.userService.from_bearer(bearer);
        if (!user) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        return await this.workspaceService.get_for_user(user);
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Create workspace" })
    @ApiHeader({ name: "Authorization", required: true })
    @ApiResponse({ status: 200, type: WorkspaceEntity })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 400, description: "Name is required" })
    async create(
        @Body() body: { name: string },
        @Headers("Authorization") bearer: string,
    ): Promise<WorkspaceEntity> {
        const { name } = body;
        const workspace = await this.workspaceService.create(name);
        const user = await this.userService.from_bearer(bearer);
        if (!user) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        await this.workspaceService.add_user(workspace, user);
        return workspace;
    }
}
