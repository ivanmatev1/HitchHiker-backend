import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { EntityManager, Repository } from 'typeorm';
import { Chat } from 'src/chats/entities/chat.entity';
import { Users } from 'src/user/entities/user.entity';
import { ChatsService } from 'src/chats/chats.service';
import { RouteStop } from './entities/routeStop.entity';
import { AddParticipantDto } from './dto/add-participant.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routesRepository: Repository<Route>,
    @InjectRepository(RouteStop)
    private readonly routeStopRepository: Repository<RouteStop>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly entityManager: EntityManager,
    private readonly chatsService: ChatsService
  ) { }

  async create(createRouteDto: CreateRouteDto, req: any) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: req.user.id },
      });
      if (!user) {
        throw new Error('User not found');
      }

      const chat = await this.chatsService.create(req);

      const { start_location, end_location, stops, ...routeDetails } = createRouteDto;

      const startLocation = new RouteStop({
        ...createRouteDto.start_location,
      });

      const endLocation = new RouteStop({
        ...createRouteDto.end_location,
      });

      const stopEntities = createRouteDto.stops.map((stop) => {
        return new RouteStop({
          ...stop,
        });
      });

      await this.entityManager.save([startLocation, endLocation, ...stopEntities]);

      const route = this.routesRepository.create({
        ...routeDetails,
        start_location: startLocation,
        end_location: endLocation,
        stops: stopEntities,
        participants: [user],
        creator: user,
        chat: chat,
      });
      console.log(route);

      await this.entityManager.save(route);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(page, limit) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [routes, total] = await this.routesRepository.findAndCount({
      skip,
      take,
      relations: {
        start_location: true,
        end_location: true,
        stops: true,
        participants: true,
        creator: true,
      },
    });

    return {
      data: routes,
      meta: {
        page, limit, total, totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllPersonal(page, limit, userId) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [routes, total] = await this.routesRepository.findAndCount({
      where: {
        participants: { id: userId },
      },
      skip,
      take,
      relations: {
        start_location: true,
        end_location: true,
        stops: true,
        participants: true,
        creator: true,
      },
    });

    return {
      data: routes,
      meta: {
        page, limit, total, totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    return await this.routesRepository.findOne({
      where: { id },
      relations: {
        start_location: true,
        end_location: true,
        stops: true,
        participants: true,
        creator: true,
        chat: true
      },
    });
  }

  async update(id: number, updateRouteDto: UpdateRouteDto, userId: number) {
    const route = await this.findOne(id);
    if (!route) {
      throw new Error(`Route with ID ${id} not found`);
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    if (route.creator.id !== user.id) {
      throw new Error('You are not the creator of this route');
    }

    Object.assign(route, updateRouteDto);
    return await this.entityManager.save(route);
  }

  async complete(id: number, userId: number) {
    const route = await this.routesRepository.findOne({
      where: { id },
      relations: {
        creator: true,
      }
    });
    if (!route) {
      throw new Error(`Route with ID ${id} not found`);
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    if (route.creator.id !== user.id) {
      throw new Error('You are not the creator of this route');
    }

    route.completed = true;
    console.log(route);
    return await this.entityManager.save(route);
  }

  async addParticipant(addParticipantDto: AddParticipantDto, req: any) {
    try {
      const route = await this.routesRepository.findOne({
        where: { id: addParticipantDto.routeId },
        relations: { participants: true, creator: true },
      });
      if (!route) {
        throw new Error(`Route with ID ${addParticipantDto.routeId} not found`);
      }

      const user = await this.userRepository.findOne({
        where: { id: req.user.id },
      });
      if (!user) {
        throw new Error('User not found');
      }
      if (route.creator.id !== user.id) {
        throw new Error('You are not the creator of this route');
      }

      const userToAdd = await this.userRepository.findOne({
        where: { id: addParticipantDto.userId },
      });
      if (!userToAdd) {
        throw new Error('User to be added not found');
      }

      const isAlreadyParticipant = route.participants.some(
        (participant) => participant.id === userToAdd.id,
      );
      if (isAlreadyParticipant) {
        throw new Error('User is already a participant');
      }

      route.participants.push(userToAdd);
      return await this.entityManager.save(route);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: number) {
    return await this.routesRepository.delete(id);
  }

  async filterRoutes(startLat: number, startLng: number, endLat: number, endLng: number, date: string, page: number, limit: number) { 
    const skip = (page - 1) * limit;
    const take = limit;

    const query = this.routesRepository.createQueryBuilder('route')
      .leftJoinAndSelect('route.start_location', 'start_location')
      .leftJoinAndSelect('route.end_location', 'end_location')
      .leftJoinAndSelect('route.stops', 'stops')
      .leftJoinAndSelect('route.participants', 'participants')
      .leftJoinAndSelect('route.creator', 'creator');

    if (startLat !== undefined && startLng !== undefined) {
      query.andWhere(
        `(
          (ABS(start_location.latitude - :startLat) <= 0.1 AND ABS(start_location.longitude - :startLng) <= 0.1) OR
          EXISTS (
            SELECT 1 FROM route_stop stops
            WHERE stops.routeId = route.id AND ABS(stops.latitude - :startLat) <= 0.1 AND ABS(stops.longitude - :startLng) <= 0.1
          )
        )`,
        { startLat, startLng },
      );
    }

    if (endLat !== undefined && endLng !== undefined) {
      query.andWhere(
        `(
          (ABS(end_location.latitude - :endLat) <= 0.1 AND ABS(end_location.longitude - :endLng) <= 0.1) OR
          EXISTS (
            SELECT 1 FROM route_stop stops
            WHERE stops.routeId = route.id AND ABS(stops.latitude - :endLat) <= 0.1 AND ABS(stops.longitude - :endLng) <= 0.1
          )
        )`,
        { endLat, endLng },
      );
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.andWhere('route.date BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay });
    }

    const [routes, total] = await query.skip(skip).take(take).getManyAndCount();

    return {
      data: routes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
