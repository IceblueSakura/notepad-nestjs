import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { Notes } from './notes.entity';
import { AuthGuard } from '@nestjs/passport';
import { NotesDto } from './notes.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('/note')
export class NotesController {
  constructor(private readonly notesService: NotesService) {
  }

  @Get('/')
  async getNotesByAuthorId(
    @Request() req,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ): Promise<any> {
    // 根据JWT记录的用户id查询所属所有notes
    return this.notesService.findContentByAuthorId(req.user.id, skip, take);
  }

  @Get('/lastModified')
  async getLastModified(@Request() req) {
    return await this.notesService.getLastModifiedDate(req.user.id);
  }

  @Get('/:id')
  async getNoteById(@Request() req, @Param('id') id: number): Promise<any> {
    const note: Notes = await this.notesService.findContentById(id);
    // 查不到这篇note
    if (note === null) {
      throw new NotFoundException();
    }
    // 查到并且作者符合jwt记录的用户id
    if (note.author_id !== req.user.id) {
      throw new UnauthorizedException();
    }
    return note;
  }

  @Get('/hash/:id')
  async getContentMD5(@Param('id') id: number): Promise<any> {
    const hash: string = await this.notesService.findContentMD5ById(id);
    if (hash === null) {
      throw new NotFoundException();
    }
    return {
      id: id, // 返回content id
      hash: hash,
    };
  }

  @Post('/update')
  async updateNoteById(@Body() note: Notes) {
    const updateResult = await this.notesService.updateContentById(note);
    if (updateResult === undefined) {
      throw new ForbiddenException();
    }
    return updateResult;
  }

  @Post('/create')
  async createNote(@Body() note: Notes, @Request() req) {
    if (
      note.title === undefined ||
      note.content === undefined ||
      note.content_type === undefined
    ) {
      throw new BadRequestException(); // 信息不全，抛出403异常
    }
    note.author_id = req.user.id; // 根据JWT Token获取操作用户的id
    return this.notesService.insertNote(note);
  }

  @Post('/delete')
  async deleteNote(@Body() note: { id: number }, @Request() req) {

    const note_author = await this.notesService.findAuthorIdById(note.id); // 获取要删除note的author_id
    if (req.user.id !== note_author.author_id) {
      throw new UnauthorizedException(); // 不是本人的Note，抛出401异常
    }
    return this.notesService.deleteNoteById(note.id);
  }
}
