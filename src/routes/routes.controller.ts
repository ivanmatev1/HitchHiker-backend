import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddParticipantDto } from './dto/add-participant.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createRouteDto: CreateRouteDto, @Request() req) {
    return this.routesService.create(createRouteDto, req);
  }

  @Patch('add-participant')
  @UseGuards(AuthGuard)
  async addParticipant(@Body() addParticipantDto: AddParticipantDto, @Request() req) {
    return this.routesService.addParticipant(addParticipantDto, req);
  }

  @Patch('complete/:id')
  @UseGuards(AuthGuard)
  async complete(@Param('id') id: string, @Request() req) {
    return this.routesService.complete(+id, req.user.id);
  }

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20,) {
    return this.routesService.findAll(page, limit);
  }

  @Get('personal')
  @UseGuards(AuthGuard)
  async findAllPersonal(@Query('page') page: number = 1, @Query('limit') limit: number = 20, @Request() req) {
    return this.routesService.findAllPersonal(page, limit, req.user.id);
  }

  @Get('filter')
  async filterRoutes(
    @Query('startLat') startLat?: number,
    @Query('startLng') startLng?: number,
    @Query('endLat') endLat?: number,
    @Query('endLng') endLng?: number,
    @Query('date') date?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.routesService.filterRoutes(startLat, startLng, endLat, endLng, date, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.routesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto, @Request() req) {
    return this.routesService.update(+id, updateRouteDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.routesService.remove(+id);
  }
}
