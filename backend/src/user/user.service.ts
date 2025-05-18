import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserEntity } from "src/entities/User";
import * as jwt from "jsonwebtoken";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntityDTO } from "../entities/User";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  create(user: UserEntityDTO): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  genJWT(usr: UserEntity): string {
    const private_key = process.env.PRIVATE_KEY ?? "private_key";
    return jwt.sign({ id: usr.id }, private_key);
  }

  verifyJWT(token: string): string {
    const private_key = process.env.PRIVATE_KEY ?? "private_key";
    return jwt.verify(token, private_key).id;
  }

  from_bearer(header: string): Promise<UserEntity | null> {
    if (header.split(" ")[0] !== "Bearer") {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
    header = header.split(" ")[1];
    const user_id = this.verifyJWT(header);
    return this.userRepository.findOne({ where: { id: user_id } });
  }

  from_credentials(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email: email, password: password },
    });
  }

  email_exists(email: string): Promise<boolean> {
    return this.userRepository
      .findOne({ where: { email: email } })
      .then((user) => user !== null);
  }
}
