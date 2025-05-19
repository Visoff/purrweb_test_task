import { Module } from "@nestjs/common";
import { UserController } from "./user/user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user/user.service";
import { UserEntity } from "./entities/User";
import { WorkspaceEntity, WorkspaceUserEntity } from "./entities/Workspace";
import { WorkspaceController } from "./workspace/workspace.controller";
import { ColumnEntity } from "./entities/Column";
import { CardEntity } from "./entities/Card";
import { WorkspaceService } from "./workspace/workspace.service";
import { ColumnController } from './column/column.controller';
import { CardController } from './card/card.controller';
import { ColumnService } from './column/column.service';
import { CardService } from './card/card.service';
import { ConfigModule } from "@nestjs/config";
import { CommentEntity } from "./entities/Comment";
import { CommentController } from "./comment/comment.controller";
import { CommentService } from "./comment/comment.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [".env"],
            isGlobal: true,
            cache: true,
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.POSTGRES_HOST || "localhost",
            port: Number(process.env.POSTGRES_PORT) || 5432,
            username: process.env.POSTGRES_USER || "postgres",
            password: process.env.POSTGRES_PASSWORD || "postgres",
            database: process.env.POSTGRES_DB || "postgres",
            entities: [
                UserEntity,
                WorkspaceEntity,
                WorkspaceUserEntity,
                ColumnEntity,
                CardEntity,
                CommentEntity
            ],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([
            UserEntity,
            WorkspaceEntity,
            WorkspaceUserEntity,
            ColumnEntity,
            CardEntity,
            CommentEntity
        ]),
    ],
    controllers: [UserController, WorkspaceController, ColumnController, CardController, CommentController],
    providers: [UserService, WorkspaceService, ColumnService, CardService, CommentService],
})
export class AppModule {}
