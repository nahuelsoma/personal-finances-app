import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsPositive,
  IsDate,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty()
  readonly ammount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly type: string;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  readonly date: Date;

  @IsOptional()
  @IsPositive()
  @ApiProperty()
  readonly categoryId: number;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  readonly userId: number;
}

export class UpdateItemDto extends PartialType(CreateItemDto) {}

export class CreateItemByUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty()
  readonly ammount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly type: string;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  readonly date: Date;

  @IsOptional()
  @IsPositive()
  @ApiProperty()
  readonly categoryId: number;
}

export class UpdateItemByUserDto extends PartialType(CreateItemByUserDto) {}
