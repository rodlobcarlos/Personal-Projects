import { IsEnum, IsObject, IsOptional, IsString, Length } from 'class-validator';
import { IsTimezone } from '../../core/validators';
import { Theme } from '../../entities/User';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 120)
  name?: string;

  @IsTimezone({ message: 'Zona horaria inválida (Use IANA, ej. America/Mexico_City)' })
  @IsOptional()
  timezone?: string;

  @IsOptional()
  @IsEnum(['light', 'dark', 'system'], { message: 'theme debe ser light, dark o system' })
  theme?: Theme;

  @IsOptional()
  @IsObject({ message: 'preferences debe ser un objeto JSON' })
  preferences?: Record<string, unknown>;
}