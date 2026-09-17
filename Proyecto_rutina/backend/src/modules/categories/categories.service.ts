import { AppDataSource } from '../../config/orm';
import { Category } from '../../entities/Category';
import { conflict, notFound } from '../../core/http-error';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

export class CategoryService {
  private readonly repository = AppDataSource.getRepository(Category);

  async list(userId: number): Promise<Category[]> {
    return this.repository.find({ where: { userId }, order: { name: 'ASC' } });
  }

  async getById(userId: number, categoryId: number): Promise<Category> {
    const category = await this.repository.findOne({ where: { id: categoryId, userId } });
    if (!category) {
      throw notFound('Categoría no encontrada');
    }
    return category;
  }

  async create(userId: number, dto: CreateCategoryDto): Promise<Category> {
    await this.ensureUniqueName(userId, dto.name);
    return this.repository.save(
      this.repository.create({
        userId,
        name: dto.name,
        color: dto.color ?? null,
        icon: dto.icon ?? null
      })
    );
  }

  async update(userId: number, categoryId: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.getById(userId, categoryId);
    if (dto.name !== undefined && dto.name !== category.name) {
      await this.ensureUniqueName(userId, dto.name);
      category.name = dto.name;
    }
    if (dto.color !== undefined) category.color = dto.color;
    if (dto.icon !== undefined) category.icon = dto.icon;
    return this.repository.save(category);
  }

  async remove(userId: number, categoryId: number): Promise<void> {
    const category = await this.getById(userId, categoryId);
    await this.repository.remove(category);
  }

  private async ensureUniqueName(userId: number, name: string): Promise<void> {
    const existing = await this.repository.findOne({ where: { userId, name } });
    if (existing) {
      throw conflict('Ya existe una categoría con ese nombre');
    }
  }
}