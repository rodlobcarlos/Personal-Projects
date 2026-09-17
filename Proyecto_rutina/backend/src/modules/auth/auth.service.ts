import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MoreThanOrEqual, IsNull } from 'typeorm';
import { AppDataSource } from '../../config/orm';
import { config } from '../../config/env';
import { User } from '../../entities/User';
import { RefreshToken } from '../../entities/RefreshToken';
import { UserRepository } from '../../repositories/UserRepository';
import { AppError, conflict, unauthorized } from '../../core/http-error';
import { LoginDto, RegisterDto } from './auth.dto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly refreshRepository = AppDataSource.getRepository(RefreshToken);

  constructor() {
    this.userRepository = new UserRepository(AppDataSource);
  }

  async register(dto: RegisterDto): Promise<{ user: User; tokens: TokenPair }> {
    const existing = await this.userRepository.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw conflict('Ya existe una cuenta con ese email');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash,
        timezone: dto.timezone ?? 'UTC',
        theme: 'system',
        preferences: {}
      })
    );

    const tokens = await this.issueTokenPair(user);
    return { user, tokens };
  }

  async login(dto: LoginDto): Promise<{ user: User; tokens: TokenPair }> {
    const user = await this.userRepository.findByEmail(dto.email.toLowerCase());
    if (!user) {
      throw unauthorized('Credenciales inválidas');
    }
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw unauthorized('Credenciales inválidas');
    }
    const tokens = await this.issueTokenPair(user);
    return { user, tokens };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const tokenHash = hashToken(refreshToken);
    const record = await this.refreshRepository.findOne({
      where: { tokenHash, revokedAt: IsNull(), expiresAt: MoreThanOrEqual(new Date()) }
    });
    if (!record) {
      throw unauthorized('Refresh token inválido o expirado');
    }
    const user = await this.userRepository.findByIdWithFields(record.userId);
    if (!user) {
      throw unauthorized('Usuario no encontrado');
    }

    // Rotación: revocamos el token usado y emitimos un par nuevo.
    record.revokedAt = new Date();
    await this.refreshRepository.save(record);
    return this.issueTokenPair(user);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    const record = await this.refreshRepository.findOne({ where: { tokenHash, revokedAt: IsNull() } });
    if (record) {
      record.revokedAt = new Date();
      await this.refreshRepository.save(record);
    }
  }

  async getCurrentUser(userId: number): Promise<User> {
    const user = await this.userRepository.findByIdWithFields(userId);
    if (!user) {
      throw unauthorized('Usuario no encontrado');
    }
    return user;
  }

  async logoutAll(userId: number): Promise<void> {
    await this.refreshRepository
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ revokedAt: new Date() })
      .where('user_id = :userId', { userId })
      .andWhere('revoked_at IS NULL')
      .execute();
  }

  private async issueTokenPair(user: User): Promise<TokenPair> {
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, type: 'access' },
      config.jwt.secret,
      { expiresIn: config.jwt.accessTtl as jwt.SignOptions['expiresIn'] }
    );
    const refreshToken = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + config.jwt.refreshTtlDays * 86_400_000);

    await this.refreshRepository.save(
      this.refreshRepository.create({
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt,
        revokedAt: null
      })
    );

    let expiresIn = 900;
    const parsed = /^(\d+)([smhd])$/.exec(config.jwt.accessTtl);
    if (parsed) {
      const value = Number(parsed[1]);
      const unit = parsed[2];
      expiresIn = unit === 's' ? value : unit === 'm' ? value * 60 : unit === 'h' ? value * 3600 : value * 86_400;
    }

    return { accessToken, refreshToken, expiresIn, tokenType: 'Bearer' };
  }
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/** Valida que un id pertenezca al usuario actual. */
export function ensureOwnership(entity: { userId: number } | null, userId: number, message = 'Recurso no encontrado'): asserts entity is NonNullable<typeof entity> {
  if (!entity || entity.userId !== userId) {
    throw new AppError(404, message);
  }
}