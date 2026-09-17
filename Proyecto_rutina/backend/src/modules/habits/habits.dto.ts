import { IsValidDate } from '../../core/validators';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { HabitFrequency } from '../../entities/Habit';

export class HabitCategoryLinkDto {
  @IsInt()
  @Min(1)
  categoryId!: number;
}

export class CreateHabitDto {
  @IsString()
  @Length(1, 120, { message: 'El nombre debe tener entre 1 y 120 caracteres' })
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(['daily', 'weekly', 'custom'], { message: 'frequency debe ser daily, weekly o custom' })
  frequency?: HabitFrequency;

  @ValidateIf((dto) => dto.frequency === 'custom')
  @IsArray({ message: 'customDays es obligatorio cuando frequency es custom' })
  @ArrayUnique({ message: 'customDays no puede repetir días' })
  @ArrayMaxSize(7)
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true, message: 'customDays usa 0=Lunes ... 6=Domingo' })
  customDays?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  targetPerDay?: number;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  color?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HabitCategoryLinkDto)
  categoryIds?: HabitCategoryLinkDto[];
}

export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(['daily', 'weekly', 'custom'])
  frequency?: HabitFrequency;

  @ValidateIf((dto) => dto.frequency === 'custom')
  @IsArray({ message: 'customDays es obligatorio cuando frequency es custom' })
  @ArrayUnique()
  @ArrayMaxSize(7)
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  customDays?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  targetPerDay?: number;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  color?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HabitCategoryLinkDto)
  categoryIds?: HabitCategoryLinkDto[];
}

export class CompleteHabitDto {
  @IsValidDate({ property: 'completionDate', optional: true })
  completionDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class UncompleteHabitDto {
  @IsValidDate({ property: 'completionDate', optional: true })
  completionDate?: string;
}