import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Route } from "./route.entity";

@Entity()
export class RouteStop {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float' })
    latitude: number;

    @Column({ type: 'float' })
    longitude: number;

    @Column()
    name: string;

    @Column()
    main_text: string;

    @ManyToOne(() => Route, (route) => route.stops, { onDelete: 'CASCADE' })
    route: Route;

    constructor(user: Partial<RouteStop>) {
        Object.assign(this, user);
    }
}