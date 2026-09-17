import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';
import { User } from './User';
import { Task } from './Task';
import { Habit } from './Habit';

@Entity('categories')
@Unique('uq_categories_user_name', ['userId', 'name'])
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'int', unsigned: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  color: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  icon: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Task, (task) => task.categories)
  tasks: Task[];

  @ManyToMany(() => Habit, (habit) => habit.categories)
  habits: Habit[];
}