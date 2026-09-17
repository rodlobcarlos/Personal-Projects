import { AppDataSource } from '../../config/orm';
import { User } from '../../entities/User';
import { UserRepository } from '../../repositories/UserRepository';
import { UpdateProfileDto } from './profile.dto';

export class ProfileService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(AppDataSource);
  }

  async getByUser(userId: number): Promise<User> {
    const user = await this.userRepository.findByIdWithFields(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }

  async update(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.timezone !== undefined) user.timezone = dto.timezone;
    if (dto.theme !== undefined) user.theme = dto.theme;
    if (dto.preferences !== undefined) user.preferences = { ...(user.preferences ?? {}), ...dto.preferences };
    await this.userRepository.save(user);
    return this.getByUser(userId);
  }
}