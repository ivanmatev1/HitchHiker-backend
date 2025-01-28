import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RouteRequestsService } from './route-requests.service';
import { CreateRouteRequestDto } from './dto/create-route-request.dto';
import { UpdateRouteRequestDto } from './dto/update-route-request.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('route-requests')
export class RouteRequestsController {
  constructor(private readonly routeRequestsService: RouteRequestsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createRouteRequestDto: CreateRouteRequestDto, @Request() req) {
    return this.routeRequestsService.create(createRouteRequestDto ,req.user.id);
  }

  @Get()
  findAll() {
    return this.routeRequestsService.findAll();
  }

  @Delete('accept/:id')
  @UseGuards(AuthGuard)
  accept(@Param('id') id: string, @Request() req) {
    return this.routeRequestsService.accept(+id, req.user.id);
  }

  @Delete('deny/:id')
  @UseGuards(AuthGuard)
  deny(@Param('id') id: string, @Request() req) {
    return this.routeRequestsService.deny(+id, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routeRequestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouteRequestDto: UpdateRouteRequestDto) {
    return this.routeRequestsService.update(+id, updateRouteRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routeRequestsService.remove(+id);
  }
}
