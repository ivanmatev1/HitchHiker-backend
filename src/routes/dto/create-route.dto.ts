import { isEnum, IsEnum, IsPositive } from 'class-validator';
import { daysOfWeek } from '../daysOfWeek.enum';
import { vehicleType } from '../vehicle.enum';

export class CreateRouteDto {
    start_location: string;
    
    end_location: string;

    begin_time: Date;

    completed: boolean;

    recurring: boolean;

    @IsPositive()
    seats: number;
    
    recurring_days_of_week: daysOfWeek[];

    @IsEnum(vehicleType)
    vehicle: vehicleType;
}
