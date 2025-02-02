import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { createMessageDto } from './dto/create-message.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createChatDto: CreateChatDto, @Request() req) {
    try {
      return await this.chatsService.create(req);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // will be removed later on
  @Get('/all')
  findAll() {
    return this.chatsService.findAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  async getPersonalChats(@Request() req) {
    try {
      return await this.chatsService.getPersonalChats(req.user.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('/add-participant')
  @UseGuards(AuthGuard)
  async addUser(@Body() updateChatDto: UpdateChatDto, @Request() req) {
    try {
      const chat = await this.chatsService.addParticipant(updateChatDto.chatId, updateChatDto.userId, req.user.id);
      return chat
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('/remove-participant')
  @UseGuards(AuthGuard)
  async removeUser(@Body() updateChatDto: UpdateChatDto, @Request() req) {
    try {
      const chat = this.chatsService.removeParticipant(updateChatDto.chatId, updateChatDto.userId, req.user.id);
      return chat
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/message')
  @UseGuards(AuthGuard)
  async sendMessage(@Body() createMessageDto: createMessageDto, @Request() req) {
    try{
      const message = this.chatsService.sendMessage(createMessageDto, req);
      return message
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.chatsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(+id, updateChatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.chatsService.remove(+id);
  }
}
