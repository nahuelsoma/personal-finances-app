import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsPositive,
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

  @IsOptional()
  @IsPositive()
  @ApiProperty()
  readonly categoryId: number;
}

export class UpdateItemDto extends PartialType(CreateItemDto) {}
