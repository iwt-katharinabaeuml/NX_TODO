import { ApiProperty } from '@nestjs/swagger';

import { MinDate } from '../decorators/custom-min-date.decorator';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum Priority {
  'high',
  'medium',
  'low',
  'none',
}

export class ErrorDto {
  @ApiProperty()
  @IsNotEmpty()
  statusCode: number;

  @ApiProperty()
  @IsOptional()
  error?: string;

  @ApiProperty()
  message: string | string[];
}

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @MinDate(new Date())
  creationDate: Date;

  @ApiProperty()
  @IsEnum(Priority)
  priority: Priority;

  @ApiProperty()
  completed: boolean;
}

export class UpdateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDateString()
  @MinDate(new Date())
  creationDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @MinDate(new Date())
  completionDate: Date;

  @ApiProperty()
  @IsEnum(Priority)
  priority: Priority;

  @ApiProperty()
  @IsBoolean()
  completed: boolean;
}

export class UpdatePartialTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @MinDate(new Date())
  creationDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @MinDate(new Date())
  completionDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Priority)
  priority: Priority;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  completed: boolean;
}

export class TaskDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @MinDate(new Date())
  creationDate: Date;

  @ApiProperty()
  @MinDate(new Date())
  completionDate: Date;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  completed: boolean;
}

export type TaskListDto = TaskDto[];
