import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * 使用用户名+密码验证登录的local验证方案
 */

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.verifyPassword(username, password);
    if (!user) {
      throw new UnauthorizedException(); // 抛出401错误(也可以返回对应值)
    }
    return user; // 返回到方法的req.user里
  }
}
