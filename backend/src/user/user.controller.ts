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
import { UserCredsDTO, UserEntity, UserEntityDTO, UserTokenDTO } from "../entities/User";
import { UserService } from "./user.service";
import { AuthGuard } from "src/auth/auth.guard";
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiHeader({ name: "Authorization", required: true })
  @ApiOperation({ summary: "Get current user", security: [{ bearerAuth: [] }] })
  @ApiResponse({ status: 200, type: UserEntity })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  findOne(@Headers("Authorization") token: string): Promise<UserEntity | null> {
    if (!token) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
    return this.userService.from_bearer(token);
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiBody({ type: UserCredsDTO })
  @ApiResponse({ status: 200, type: UserTokenDTO })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async login(
    @Body() user: UserCredsDTO,
  ): Promise<UserTokenDTO> {
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
  @ApiOperation({ summary: "Create user" })
  @ApiBody({ type: UserEntityDTO })
  @ApiResponse({ status: 200, type: UserTokenDTO })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async create(@Body() user: UserEntityDTO): Promise<{ token: string }> {
    if (await this.userService.email_exists(user.email)) {
      throw new HttpException("User already exists", HttpStatus.CONFLICT);
    }
    return {token: this.userService.genJWT(await this.userService.create(user))};
  }
}
