import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidDate } from '../../core/validators';
import { TaskPriority, TaskStatus } from '../../entities/Task';

export class TaskCategoryLinkDto {
  @IsInt()
  @Min(1)
  categoryId!: number;
}

export class CreateTaskDto {
  @IsString()
  @Length(1, 200, { message: 'El título debe tener entre 1 y 200 caracteres' })
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsValidDate({ property: 'dueDate', optional: true })
  @IsOptional()
  dueDate?: string;

  @IsOptional()
  @IsString({ message: 'dueTime debe usar formato HH:mm o HH:mm:ss' })
  dueTime?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'], { message: 'priority debe ser low, medium o high' })
  priority?: TaskPriority;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskCategoryLinkDto)
  categoryIds?: TaskCategoryLinkDto[];
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsValidDate({ property: 'dueDate', optional: true })
  @IsOptional()
  dueDate?: string;

  @IsOptional()
  @IsString()
  dueTime?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(['pending', 'completed'])
  status?: TaskStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskCategoryLinkDto)
  categoryIds?: TaskCategoryLinkDto[];
}

export class TaskListQueryDto {
  @IsOptional()
  @IsEnum(['pending', 'completed'])
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: TaskPriority;

  @IsValidDate({ property: 'from', optional: true })
  @IsOptional()
  from?: string;

  @IsValidDate({ property: 'to', optional: true })
  @IsOptional()
  to?: string;

  @IsOptional()
  overdue?: boolean;
}

export class CompleteTaskDto {
  @IsValidDate({ property: 'completionDate', optional: true })
  completionDate?: string;
}