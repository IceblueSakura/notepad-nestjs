import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { FilesService } from '../files/files.service';

@Controller('/user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly filesService: FilesService,
  ) {}

  /**
   * 使用{username:xx, password:xx}的方式登录
   * @param req.user local.strategy.ts返回的登陆成功user实体
   */
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req): Promise<any> {
    return this.authService.generateJWT(req.user);
  }

  /**
   * 使用Header: {Authorization: Bearer xxx}的方式验证JWT有效性进行登录
   * @param req.user jwt.strategy.ts返回的登陆成功user实体
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/jwt-refresh')
  async test(@Request() req): Promise<any> {
    return this.authService.generateJWT(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getAllUserInfo(@Request() req): Promise<any> {
    const user = await this.usersService.findUserById(req.user.id);
    // user.password = null;
    const { username, nickname, avatar } = user; // 解构赋值
    return {
      username: username,
      nickname: nickname,
      avatar: avatar,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateByUsername(@Body() user: Users): Promise<any> {
    if (user.password !== undefined) {
      user.password = this.authService.generatePasswordHash(
        user.password, // 如果需要修改密码，那就加密后存入数据库
      );
    }
    return this.usersService.updateUserByUsername(user);
  }

  @Post('/register')
  async registerUser(@Body() user: Users): Promise<any> {
    if (
      user.username === undefined ||
      user.password === undefined ||
      user.nickname === undefined ||
      user.avatar === undefined
    ) {
      throw new BadRequestException(); // 信息不全，抛出400异常
    }
    user.password = this.authService.generatePasswordHash(
      user.password, // 加密后存入数据库
    );
    user.avatar = 'file/img/' + user.avatar;  // 把id修改为相对地址

    const insertUser = await this.usersService.insertUser(user);

    try {
      await this.filesService.updateId(Number(user.avatar), insertUser.id);
    } catch (err) {}

    if ((await insertUser) === 'exist') {
      throw new ForbiddenException();
    }
    return insertUser;
  }
}
