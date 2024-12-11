import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager, Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  // exposes methods so we can interact with database
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly entityManager: EntityManager
  ){}

  async create(createUserDto: CreateUserDto) {
    const user = new Users(createUserDto);
    return await this.entityManager.save(user);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    return this.usersRepository.findOneBy({id});
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
}
