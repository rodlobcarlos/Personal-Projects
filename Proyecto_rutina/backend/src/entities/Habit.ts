import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './User';
import { Category } from './Category';

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'int', unsigned: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'simple-enum', enum: ['daily', 'weekly', 'custom'], default: 'daily' })
  frequency: HabitFrequency;

  @Column({ name: 'custom_days', type: 'json', nullable: true })
  customDays: number[] | null;

  @Column({ name: 'target_per_day', type: 'smallint', unsigned: true, default: 1 })
  targetPerDay: number;

  @Column({ type: 'varchar', length: 64, nullable: true })
  icon: string | null;

  @Column({ type: 'varchar', length: 16, nullable: true })
  color: string | null;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Category, (category) => category.habits)
  @JoinTable({
    name: 'habit_categories',
    joinColumn: { name: 'habit_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories: Category[];
}