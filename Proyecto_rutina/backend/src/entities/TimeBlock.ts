import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './User';
import { Task } from './Task';
import { Habit } from './Habit';

@Entity('time_blocks')
@Check('chk_tb_time_range', 'start_time < end_time')
export class TimeBlock {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'int', unsigned: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'task_id', type: 'int', unsigned: true, nullable: true })
  taskId: number | null;

  @ManyToOne(() => Task, (task) => task.id, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'task_id' })
  task: Task | null;

  @Column({ name: 'habit_id', type: 'int', unsigned: true, nullable: true })
  habitId: number | null;

  @ManyToOne(() => Habit, (habit) => habit.id, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'habit_id' })
  habit: Habit | null;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ name: 'block_date', type: 'date' })
  blockDate: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  color: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}