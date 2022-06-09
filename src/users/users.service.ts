import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {
  }

  async findUserByUsername(username: string): Promise<Users | undefined> {
    return this.usersRepository
      .createQueryBuilder() // 查询特定列，需要设置别名
      .where('username=:username', { username: username })
      .getOne();
  }

  /**
   * 根据username更新user，username来源对象内
   * @param user 把传入的json自动装载到users.entity内
   */
  async updateUserByUsername(user: Users): Promise<number> {
    const updateResult = await this.usersRepository
      .createQueryBuilder()
      .update(Users)
      .set(user)
      .where('username=:username', { username: user.username })
      .execute();
    return updateResult.affected; // 受影响行数
  }

  async findUserById(id: number): Promise<Users> {
    return this.usersRepository
      .createQueryBuilder()
      .where('id=:id', { id: id })
      .getOne();
  }

  async usernameExist(username: string): Promise<boolean> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.username')
      .where('username=:username', { username: username })
      .getOne();
    return user !== null && user.username === username;

  }

  async insertUser(user: Users): Promise<any> {
    if (await this.usernameExist(user.username)) {
      console.log('用户存在了');
      return 'exist';
    }
    const insertResult = await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values(user)
      .execute();

    return {
      id: insertResult.raw.insertId,
      username: user.username,
      nickname: user.nickname,
    };
  }
}
