import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
@Entity()
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id_key: number;
  @Column()
  reader: string;
  @ManyToOne(() => User, user => user.key)
  user: User;

  @Column({
    nullable: false,
  })
  timestamp: number;
}
