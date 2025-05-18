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

@Module({
  imports: [
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
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      WorkspaceEntity,
      WorkspaceUserEntity,
      ColumnEntity,
      CardEntity,
    ]),
  ],
  controllers: [UserController, WorkspaceController, ColumnController, CardController],
  providers: [UserService, WorkspaceService, ColumnService, CardService],
})
export class AppModule {}
