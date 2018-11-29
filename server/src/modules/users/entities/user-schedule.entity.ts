import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserSchedule {
  @Column()
  @PrimaryGeneratedColumn()
  uid: string;

  @Column()
  day: string;

  @Column()
  hour: string;

  @Column()
  room: string;

  @ManyToOne(() => User, user => user.schedule)
  user: User;
}
