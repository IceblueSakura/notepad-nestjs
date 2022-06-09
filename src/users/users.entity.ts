import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {

  // 默认所有项 NOT NULL
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column()
  avatar: string;
}
