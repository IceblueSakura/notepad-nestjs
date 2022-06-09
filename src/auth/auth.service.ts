import { Injectable } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, private readonly jwtService: JwtService,
  ) {}

  generatePasswordHash(password: string): string {
    return hashSync(password, genSaltSync(10));
  }

  async verifyPassword(
    username: string,
    password: string,
  ): Promise<Users | null> {
    const user = await this.usersService.findUserByUsername(username);
    // 前是请求的密码，后是数据库的密码hash
    if (compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  generateJWT(user: Users): any {
    const payload = { id: user.id, username: user.username };
    return {
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      token: this.jwtService.sign(payload),
      expires: new Date(new Date().valueOf() + 24 * 60 * 60 * 1000), // 传递过期时间为24h后的时间
    };
  }
}
