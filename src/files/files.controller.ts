import {
  Controller,
  Get,
  Header,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { APIServer } from '../../config';

// @UseGuards(AuthGuard('jwt'))
@Controller('/file')
export class FilesController {
  constructor(private readonly filesService: FilesService) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  // 提供给编辑器上传文件
  async upload(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const insertId = await this.filesService.upload(file.buffer, req.user.id);
    return {
      // wangEditor的标准
      errno: 0, // 成功标识，number
      data: {
        url: APIServer + '/file/img/' + insertId, // 图片 src ，必须
        alt: '', // 图片描述文字，非必须
        href: '', // 图片的链接，非必须
      },
    };
  }

  @Post('/upload-signup')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSignUp(@UploadedFile() file: Express.Multer.File) {
    // 默认使用default用户的Id
    const id = await this.filesService.upload(file.buffer, 1);
    return {
      avatar_id: id,
      avatar_url: APIServer + '/file/img/' + id,
    };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('/img/:id')
  @Header('Content-Type', 'image/png')
  async getFile(@Param('id') id: number, @Res() res) {
    const file_entity = await this.filesService.findFile(id);
    res.write(file_entity.file, 'binary');
    res.end();
  }
}
