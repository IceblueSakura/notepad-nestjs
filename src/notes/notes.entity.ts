import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Notes {
  // 默认所有项 NOT NULL
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column()
  content_type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: number;

  @Column()
  author_id: number;
}
