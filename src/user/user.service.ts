import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager, Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatDto } from 'src/chats/dto/create-chat.dto';
import { Chat } from 'src/chats/entities/chat.entity';

@Injectable()
export class UserService {
  // exposes methods so we can interact with database
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly entityManager: EntityManager
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.usersRepository.create({
        ...createUserDto,
        chats: [],
        messages: [],
      });
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') { // error code for unique violations
        if (error.detail.includes('email')) {
          throw new ConflictException('A user with this email already exists.');
        }
        if (error.detail.includes('phone_number')) {
          throw new ConflictException('A user with this phone number already exists.');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({ 
      where: {id},
      relations: {chats: true}
     });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    // copying only the existing value in updateUserDto to user
    Object.assign(user, updateUserDto);
    return await this.entityManager.save(user);
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }

  async findByEmail(email: string): Promise<Users | null> {
    try {
      return await this.usersRepository.findOneBy({ email });
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }

}
