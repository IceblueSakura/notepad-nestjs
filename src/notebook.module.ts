import { Module } from '@nestjs/common';
import { NotesModule } from './notes/notes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notes } from './notes/notes.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Users } from './users/users.entity';
import { FilesModule } from './files/files.module';
import { Files } from './files/file.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'notepad',
      password: 'notepad',
      database: 'notepad',
      logging: true,
      entities: [Notes, Users, Files],
      // 关闭自动创建数据库
      synchronize: false,
    }),
    NotesModule,
    UsersModule,
    AuthModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class NotebookModule {
}
