import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({
    message: 'A valid email adress is needed',
  })
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must have at least 8 characters',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly role: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
