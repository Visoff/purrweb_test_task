import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserCredsDTO, UserEntity, UserEntityDTO } from "../entities/User";
import { UserService } from "./user.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  findOne(@Headers("Authorization") token: string): Promise<UserEntity | null> {
    if (!token) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
    return this.userService.from_bearer(token);
  }

  @Post("login")
  async login(
    @Body() user: UserCredsDTO,
  ): Promise<{token: string}> {
    const userFromDB = await this.userService.from_credentials(
      user.email,
      user.password,
    );
    if (!userFromDB) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return {token: this.userService.genJWT(userFromDB)};
  }

  @Post()
  async create(@Body() user: UserEntityDTO): Promise<{ token: string }> {
    if (await this.userService.email_exists(user.email)) {
      throw new HttpException("User already exists", HttpStatus.CONFLICT);
    }
    return {token: this.userService.genJWT(await this.userService.create(user))};
  }
}
