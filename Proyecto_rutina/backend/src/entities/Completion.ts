import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
import { User } from './User';
import { Habit } from './Habit';
import { Task } from './Task';

@Entity('completions')
@Unique('uq_completions_scope', ['userId', 'habitId', 'taskId', 'completionDate'])
@Check('chk_completions_one_target', `(habit_id IS NOT NULL AND task_id IS NULL) OR (habit_id IS NULL AND task_id IS NOT NULL)`)
export class Completion {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'int', unsigned: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'habit_id', type: 'int', unsigned: true, nullable: true })
  habitId: number | null;

  @ManyToOne(() => Habit, (habit) => habit.id, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'habit_id' })
  habit: Habit | null;

  @Column({ name: 'task_id', type: 'int', unsigned: true, nullable: true })
  taskId: number | null;

  @ManyToOne(() => Task, (task) => task.id, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'task_id' })
  task: Task | null;

  @Column({ name: 'completion_date', type: 'date' })
  completionDate: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  note: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}