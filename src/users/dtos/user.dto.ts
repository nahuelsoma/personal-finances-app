import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  @ApiProperty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @ApiProperty()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Length(2, 50)
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 50)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly role: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
