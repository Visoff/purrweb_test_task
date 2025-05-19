import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ description: 'User id' })
    id: string;

    @Column()
    @ApiProperty({ description: 'User name' })
    name: string;

    @Column()
    @Unique(['email'])
    @ApiProperty({ description: 'User email' })
    email: string;

    @Column()
    @ApiProperty({ description: 'User password' })
    password: string;

    @CreateDateColumn()
    @ApiProperty({ description: 'User password' })
    created_at: Date;

    @UpdateDateColumn()
    @ApiProperty({ description: 'User password' })
    updated_at: Date;
}

export class UserEntityDTO {
    @IsString()
    @ApiProperty({ description: 'User name' })
    name: string;

    @IsEmail()
    @ApiProperty({ description: 'User email' })
    email: string;

    @IsString()
    @ApiProperty({ description: 'User password' })
    password: string;
}

export class UserCredsDTO {
    @IsString()
    @ApiProperty({ description: 'User email' })
    email: string;

    @IsString()
    @ApiProperty({ description: 'User password' })
    password: string;
}

export class UserTokenDTO {
    @IsString()
    @ApiProperty({ description: 'JWT token' })
    token: string;
}
