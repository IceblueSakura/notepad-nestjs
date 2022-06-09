import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Files {
  // 默认所有项 NOT NULL
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longblob' })
  file: Buffer;

  @Column()
  author_id: number;
}
