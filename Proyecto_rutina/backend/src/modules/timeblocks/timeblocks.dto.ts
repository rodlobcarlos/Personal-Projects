import { IsInt, IsOptional, IsString, Length, MaxLength, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidDate } from '../../core/validators';

export class CreateTimeBlockDto {
  @IsString()
  @Length(1, 200, { message: 'El título debe tener entre 1 y 200 caracteres' })
  title!: string;

  @IsValidDate({ property: 'blockDate' })
  blockDate!: string;

  @IsString({ message: 'startTime debe usar formato HH:mm o HH:mm:ss' })
  startTime!: string;

  @IsString({ message: 'endTime debe usar formato HH:mm o HH:mm:ss' })
  endTime!: string;

  @ValidateIf((dto) => dto.taskId !== undefined && dto.taskId !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  taskId?: number;

  @ValidateIf((dto) => dto.habitId !== undefined && dto.habitId !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  habitId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  color?: string;
}

export class UpdateTimeBlockDto {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  title?: string;

  @IsValidDate({ property: 'blockDate', optional: true })
  @IsOptional()
  blockDate?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  taskId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  habitId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  color?: string;
}