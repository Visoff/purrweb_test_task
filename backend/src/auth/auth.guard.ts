import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "../user/user.service";
import { WorkspaceService } from "../workspace/workspace.service";
import { ColumnService } from "src/column/column.service";
import { CardService } from "src/card/card.service";
import { CommentService } from "src/comment/comment.service";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return false;
    }
    return req.headers.authorization.startsWith("Bearer ");
  }
}

export class AuthGuardWorkspace implements CanActivate {
  constructor(
        private readonly workspacesService: WorkspaceService,
        private readonly userService: UserService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return false;
    }
    const user = await this.userService.from_bearer(req.headers.authorization)
    if (!user) {
        return false;
    }
    const workspace = await this.workspacesService.get(req.params.id)
    if (!workspace) {
        return false;
    }
    if (!this.workspacesService.has_user(workspace, user)) {
        return false;
    }
    return true
  }
}

export class AuthGuardColumn implements CanActivate {
  constructor(
        private readonly columnService: ColumnService,
        private readonly userService: UserService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return false;
    }
    const user = await this.userService.from_bearer(req.headers.authorization)
    if (!user) {
        return false;
    }
    const column = await this.columnService.get(req.params.id)
    if (!column) {
        return false;
    }
    if (!this.columnService.has_user(column, user)) {
        return false;
    }
    return true
  }
}

export class AuthGuardCard implements CanActivate {
  constructor(
        private readonly cardService: CardService,
        private readonly userService: UserService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return false;
    }
    const user = await this.userService.from_bearer(req.headers.authorization)
    if (!user) {
        return false;
    }
    const card = await this.cardService.get(req.params.id)
    if (!card) {
        return false;
    }
    if (!this.cardService.has_user(card, user)) {
        return false;
    }
    return true
  }
}

export class AuthGuardComment implements CanActivate {
  constructor(
        private readonly commentService: CommentService,
        private readonly userService: UserService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return false;
    }
    const user = await this.userService.from_bearer(req.headers.authorization)
    if (!user) {
        return false;
    }
    const comment = await this.commentService.get(req.params.id)
    if (!comment) {
        return false;
    }
    if (!this.commentService.has_user(comment, user)) {
        return false;
    }
    return true
  }
}
