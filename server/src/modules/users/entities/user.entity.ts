import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { UserSchedule } from './user-schedule.entity';
import { AuthEntity } from '../../auth/entities/auth.entity';
@Entity()
export class User {
  @Column()
  @PrimaryColumn()
  uid: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(type => AuthEntity, auth => auth.user)
  auths: AuthEntity[];

  @Column({
    nullable: true,
  })
  key: string;

  @OneToMany(type => UserSchedule, userSchedule => userSchedule.user)
  schedule: UserSchedule[];
}
