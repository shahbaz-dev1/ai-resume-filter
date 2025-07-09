import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Entity to log user activities for auditing and monitoring.
 */
@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  action: string;

  @CreateDateColumn()
  timestamp: Date;
} 