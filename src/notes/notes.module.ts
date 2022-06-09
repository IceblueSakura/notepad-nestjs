import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { Notes } from './notes.entity';
import { NotesController } from './notes.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Notes])],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
