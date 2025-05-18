import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IsEmail, IsString, ValidateIf } from 'class-validator';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    @Unique(['email'])
    email: string;

    @Column()
    password: string;
}

export class UserEntityDTO {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class UserCredsDTO {
    @IsString()
    email: string;

    @IsString()
    password: string;
}
