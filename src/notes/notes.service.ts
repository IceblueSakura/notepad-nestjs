import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notes } from './notes.entity';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Notes)
    private notesRepository: Repository<Notes>,
  ) {
  }

  async findContentByAuthorId(
    author_id: number,
    skip: number,
    take: number,
  ): Promise<Notes[]> {
    const queryBuilder = this.notesRepository
      .createQueryBuilder()
      .where('author_id=:author_id', { author_id: author_id });
    if (skip !== undefined && take !== undefined) {
      queryBuilder.skip(skip).take(take); // 加上分页选项
    }
    return queryBuilder.getMany();
  }

  async findContentSumTest(author_id: number): Promise<any> {
    return this.notesRepository
      .createQueryBuilder('note')
      .select('sum(note.author_id)', '总计')
      .where('author_id=:author_id', { author_id: author_id })
      .getRawMany();
  }

  async findContentById(id: number): Promise<Notes | null> {
    return this.notesRepository
      .createQueryBuilder()
      .where('id=:id', { id: id })
      .getOne();
  }

  async findContentMD5ById(id: number): Promise<string> {
    const note: Notes = await this.notesRepository
      .createQueryBuilder()
      .where('id=:id', { id: id })
      .getOne();
    if (note === null) {
      return null;
    }
    return createHash('md5').update(note.content).digest('hex');
  }

  // 根据记事本id查找用户id
  async findAuthorIdById(id: number) {
    return await this.notesRepository
      .createQueryBuilder('note')
      .select('note.author_id')
      .where('id=:id', { id: id })
      .getOne();
  }

  async updateContentById(note: Notes): Promise<any> {
    if (note.create_date === undefined) {
      note.create_date = new Date().valueOf();
    }
    const updateResult = await this.notesRepository
      .createQueryBuilder()
      .update(note)
      .set(note)
      .where('id=:id', { id: note.id })
      .execute();

    // affected:受影响行数
    // 如果修改成功，则返回内容
    if (updateResult.affected >= 1) {
      return {
        id: note.id,
        title: note.title,
        create_date: new Date(note.create_date),
      };
    }
    return undefined;
  }

  async insertNote(note: Notes): Promise<any> {
    // 如果前端没传递创建时间
    if (note.create_date === undefined) {
      note.create_date = new Date().valueOf(); // 用现在时间timestamp
    }
    const insertResult = await this.notesRepository
      .createQueryBuilder()
      .insert()
      .into(Notes)
      .values({
        id: undefined, // 自动生成主键
        title: note.title,
        content: note.content,
        content_type: note.content_type,
        author_id: note.author_id,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        create_date: 'from_unixtime(' + note.create_date + ')', // 使用mysql函数
      })
      .execute();
    return {
      id: insertResult.raw.insertId,
      title: note.title,
      create_date: new Date(note.create_date), // 转成Date对象再返回前端
    };
  }

  async deleteNoteById(id: number) {
    return this.notesRepository
      .createQueryBuilder()
      .delete()
      .from(Notes)
      .where('id=:id', { id: id })
      .execute();
  }

  async getLastModifiedDate(author_id: number): Promise<any> {
    return this.notesRepository
      .createQueryBuilder('note')
      .select('max(note.create_date)', 'last_modified')
      .where('author_id=:author_id', { author_id: author_id })
      .getRawOne();
  }
}
