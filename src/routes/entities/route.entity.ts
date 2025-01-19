import { Entity, Column, PrimaryGeneratedColumn, Check, ManyToMany } from "typeorm";
import { daysOfWeek } from '../daysOfWeek.enum';
import { vehicleType } from '../vehicle.enum';
import { Users } from "src/user/entities/user.entity";

Check('"seats">0')
@Entity('routes')
export class Route {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    start_location: string;

    @Column()
    end_location: string;
    // date with hours
    @Column({ type: 'timestamp' })
    begin_time: Date;

    @Column({default: false})
    completed: boolean;

    @Column({default: false})
    recurring: boolean;
    
    @Column()
    seats: number;

    @Column({type: 'enum', enum: daysOfWeek, nullable: true, array: true})
    recurring_days_of_week: daysOfWeek[];

    @Column({type: 'enum', enum: vehicleType})
    vehicle: vehicleType;

    @Column({type: 'text',array: true, nullable: true})
    stops: string[];

    @ManyToMany(() => Users, (user) => user.routes)
    users: Users[];

    constructor(user: Partial<Route>){
        Object.assign(this, user);
    }
}
