import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';
import { IsTimezone } from '../../core/validators';

export class RegisterDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  @Length(5, 255)
  email!: string;

  @IsString({ message: 'El nombre es obligatorio' })
  @Length(2, 120, { message: 'El nombre debe tener entre 2 y 120 caracteres' })
  name!: string;

  @IsString()
  @Length(8, 72, { message: 'La contraseña debe tener entre 8 y 72 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe incluir mayúscula, minúscula y número'
  })
  password!: string;

  @IsOptional()
  @IsTimezone({ message: 'Zona horaria inválida (Use IANA, ej. America/Mexico_City)' })
  timezone?: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  email!: string;

  @IsString()
  @Length(1, 72)
  password!: string;
}

export class RefreshDto {
  @IsString()
  @Length(64, 255, { message: 'El refresh token no es válido' })
  refreshToken!: string;
}

export class LogoutDto {
  @IsString()
  @Length(64, 255, { message: 'El refresh token no es válido' })
  refreshToken!: string;
}