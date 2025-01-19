import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routesRepository: Repository<Route>,
    private readonly entityManager: EntityManager
  ){}

  async create(createRouteDto: CreateRouteDto) {
    const route = new Route(createRouteDto);
    return await this.entityManager.save(route);
  }

  async findAll() {
    return this.routesRepository.find();
  }

  async findOne(id: number) {
    return this.routesRepository.findOneBy({id});
  }

  async update(id: number, updateRouteDto: UpdateRouteDto) {
    const route = await this.routesRepository.findOneBy({ id });
    if (!route) {
      throw new Error(`Route with ID ${id} not found`);
    }
    Object.assign(route, updateRouteDto);
    return await this.entityManager.save(route);
  }
}
