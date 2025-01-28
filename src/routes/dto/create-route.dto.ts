import { CreateRouteStopDto } from './create-route-stop.dto';

export class CreateRouteDto {
    start_location: CreateRouteStopDto;

    end_location: CreateRouteStopDto;

    stops: CreateRouteStopDto[];

    date: Date;

    completed: boolean;

    passangers: number;
}
