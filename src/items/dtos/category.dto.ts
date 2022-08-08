import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty()
  readonly ammount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly type: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
