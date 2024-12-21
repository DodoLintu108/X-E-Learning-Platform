// create-course.dto.ts
import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DifficultyLevel {
  Easy = 'Easy',
  Intermediate = 'Intermediate',
  Hard = 'Hard',
}

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsEnum(DifficultyLevel)
  difficultyLevel: DifficultyLevel;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  courseMaterial: Express.Multer.File;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  courseImage: Express.Multer.File;
}
