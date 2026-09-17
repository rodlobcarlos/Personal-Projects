import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/User';

export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.manager);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  findByIdWithFields(id: number): Promise<User | null> {
    return this.findOne({ where: { id }, select: ['id', 'email', 'name', 'googleId', 'timezone', 'preferences', 'theme', 'createdAt', 'updatedAt'] });
  }
}