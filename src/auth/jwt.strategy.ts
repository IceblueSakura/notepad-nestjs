import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

/**
 * 使用JWT验证登录的jwt验证方法
 * 读取Authorization头
 * 内容 Bearer xxx
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // 继承后实现方法，以实现鉴权
  async validate(payload: any): Promise<any> {
    return { id: payload.id, username: payload.username };
  }
}
