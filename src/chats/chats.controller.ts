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
  create(@Body() createChatDto: CreateChatDto, @Request() req) {
    return this.chatsService.create(req);
  }

  // will be removed later on
  @Get('/all')
  findAll() {
    return this.chatsService.findAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  getPersonalChats(@Request() req) {
    return this.chatsService.getPersonalChats(req.user.id);
  }

  @Patch('/add-participant')
  @UseGuards(AuthGuard)
  addUser(@Body() updateChatDto: UpdateChatDto, @Request() req) {
    try {
      const chat = this.chatsService.addParticipant(updateChatDto.chatId, updateChatDto.userId, req);
      return chat
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('/remove-participant')
  @UseGuards(AuthGuard)
  removeUser(@Body() updateChatDto: UpdateChatDto, @Request() req) {
    try {
      const chat = this.chatsService.removeParticipant(updateChatDto.chatId, updateChatDto.userId, req);
      return chat
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/message')
  @UseGuards(AuthGuard)
  sendMessage(@Body() createMessageDto: createMessageDto, @Request() req) {
    try{
      const message = this.chatsService.sendMessage(createMessageDto, req);
      return message
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(+id);
  }
}
