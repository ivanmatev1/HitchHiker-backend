import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { EntityManager, Repository } from 'typeorm';
import { Users } from 'src/user/entities/user.entity';
import { createMessageDto } from './dto/create-message.dto';
import { Message } from './entities/messages.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly entityManager: EntityManager
  ) { }

  async create(createChatDto: CreateChatDto, req: any) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: req.user.id },
      });

      if (!user) {
        throw new Error('User not found');
      }
      const chat = this.chatRepository.create({
        ...createChatDto,
        participants: [user],
        messages: [],
      });
      return await this.chatRepository.save(chat);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addParticipant(chatId: number, userId: number, req: any) {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id: chatId },
        relations: { participants: true },
      });
      if (!chat) {
        throw new Error('Chat not found');
      }

      const isUserInChat = chat.participants.some(
        (participant) => participant.id === req.user.id,
      );
      if (!isUserInChat) {
        throw new Error('You are not a participant in this chat');
      }

      const userToAdd = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!userToAdd) {
        throw new Error('User to be added not found');
      }

      const isAlreadyParticipant = chat.participants.some(
        (participant) => participant.id === userId,
      );
      if (isAlreadyParticipant) {
        throw new Error('User is already a participant in the chat');
      }

      chat.participants.push(userToAdd);
      return await this.chatRepository.save(chat);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async removeParticipant(chatId: number, userId: number, req: any) {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id: chatId },
        relations: { participants: true }, 
      });
      if (!chat) {
        throw new Error('Chat not found');
      }

      const isUserInChat = chat.participants.some(
        (participant) => participant.id === req.user.id,
      );
      if (!isUserInChat) {
        throw new Error('You are not a participant in this chat');
      }

      const userToRemove = chat.participants.find(
        (participant) => participant.id === userId,
      );
      if (!userToRemove) {
        throw new Error('User is not a participant in this chat');
      }

      chat.participants = chat.participants.filter(
        (participant) => participant.id !== userId,
      );
      return await this.chatRepository.save(chat);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendMessage(createMessageDto: createMessageDto, req: any) {
    const { chatId, text } = createMessageDto;

    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: { participants: true },
    });
    if (!chat) {
      throw new Error('Chat not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      throw new Error('User not found');
    }    

    const isUserInChat = chat.participants.some(
      (participant) => participant.id === req.user.id,
    );
    if (!isUserInChat) {
      throw new Error('You are not a participant in this chat');
    }
   
    const message = this.messageRepository.create({
      text: text,
      chat:chat,
      sender: user,
    });

    return await this.messageRepository.save(message);
  }

  async findAll() {
    return await this.chatRepository.find(
      {
        relations: { participants: true },
      }
    );
  }

  // retuns all the right chats, doesnt display other participants, its ok the information we need will be coming from routes
  async getPersonalChats(userId: number) {
    return await this.chatRepository.find({
      where: { participants: { id: userId } },
      relations: { participants: true },
    });
  }

  async findOne(id: number) {
    return await this.chatRepository.findOne({
      where: { id },
      relations: {
        participants: true,
        messages: {
          sender: true,
        },
      },
    });
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  async remove(id: number) {
    return await this.chatRepository.delete(id);
  }
}
