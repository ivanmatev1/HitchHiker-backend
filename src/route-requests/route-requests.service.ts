import { Injectable } from '@nestjs/common';
import { CreateRouteRequestDto } from './dto/create-route-request.dto';
import { UpdateRouteRequestDto } from './dto/update-route-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from 'src/routes/entities/route.entity';
import { Users } from 'src/user/entities/user.entity';
import { Repository, EntityManager } from 'typeorm';
import { RouteRequest } from './entities/route-request.entity';
import { RoutesService } from 'src/routes/routes.service';

@Injectable()
export class RouteRequestsService {
  constructor(
    @InjectRepository(RouteRequest)
    private readonly routeRequestRepository: Repository<RouteRequest>,
    @InjectRepository(Route)
    private readonly routesRepository: Repository<Route>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly routesService: RoutesService,
    private readonly entityManager: EntityManager,
  ) { }
  async create(createRouteRequestDto: CreateRouteRequestDto, senderId: number) {
    try {
      const sender = await this.userRepository.findOne({
        where: { id: senderId },
      });
      if (!sender) {
        throw new Error('Sender not found');
      }

      const route = await this.routesRepository.findOne({
        where: { id: createRouteRequestDto.routeId },
        relations: { participants: true, creator: true },
      });
      if (!route) {
        throw new Error('Route not found');
      }

      const isSenderParticipant = route.participants.some(
        (participant) => participant.id === sender.id,
      );
      if (isSenderParticipant) {
        throw new Error('Sender is already a participant in this route');
      }

      const existingRequest = await this.routeRequestRepository.findOne({
        where: {
          sender: { id: senderId },
          route: { id: createRouteRequestDto.routeId },
        },
      });
      if (existingRequest) {
        throw new Error('A request from this sender to this route already exists');
      }

      const receiver = await this.userRepository.findOne({
        where: { id: route.creator.id },
      });
      if (!receiver) {
        throw new Error('Receiver not found');
      }

      const routeRequest = this.routeRequestRepository.create({
        ...createRouteRequestDto,
        sender: sender,
        receiver: receiver,
        route: route,
      });

      return await this.entityManager.save(routeRequest);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async accept(id: number, receiverId: number) {
    try {
      const routeRequest = await this.routeRequestRepository.findOne({
        where: { id },
        relations: { sender: true, receiver: true, route: true },
      });
      if (!routeRequest) {
        throw new Error('Route request not found');
      }

      if (routeRequest.receiver.id !== receiverId) {
        throw new Error('Only the receiver can accept the route request');
      }

      await this.routesService.addParticipant({ userId: routeRequest.sender.id, routeId: routeRequest.route.id }, receiverId);
      return await this.remove(id);
      } catch (error) {
      throw new Error(error.message);
    }
  }

  async deny(id: number, receiverId: number) {
    try {
      const routeRequest = await this.routeRequestRepository.findOne({
        where: { id },
        relations: { sender: true, receiver: true, route: true },
      });
      if (!routeRequest) {
        throw new Error('Route request not found');
      }

      if (routeRequest.receiver.id !== receiverId) {
        throw new Error('Only the receiver can deny the route request');
      }

      return await this.remove(id);
      } catch (error) {
      throw new Error(error.message);
    }
  }

  findAll() {
    return `This action returns all routeRequests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} routeRequest`;
  }

  update(id: number, updateRouteRequestDto: UpdateRouteRequestDto) {
    return `This action updates a #${id} routeRequest`;
  }

  async remove(id: number) {
    return await this.routeRequestRepository.delete(id);
  }
}
