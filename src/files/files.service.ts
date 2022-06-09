import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Files } from './file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    private filesRepository: Repository<Files>) {
  }


  // 返回创建的id，失败返回0
  async upload(file: Buffer, author_id: number): Promise<number> {
    const insertResult = await this.filesRepository
      .createQueryBuilder()
      .insert()
      .into(Files)
      .values({
        id: undefined,
        file: file,
        author_id: author_id,
      })
      .execute();
    return insertResult.raw.affectedRows !== 0 ? insertResult.raw.insertId : 0;
  }

  async findFile(id: number) {
    return this.filesRepository
      .createQueryBuilder()
      .where('id=:id', { id: id })
      .getOne();
  }

  async deleteById(id: number) {
    return this.filesRepository
      .createQueryBuilder()
      .delete()
      .from(Files)
      .where('id=:id', { id: id })
      .execute();
  }

  // 注册完成后更新id到现在用户
  async updateId(id: number, author_id: number) {
    return this.filesRepository
      .createQueryBuilder()
      .update(Files)
      .set({ author_id: author_id })
      .where('id=:id', { id: id });
  }
}
