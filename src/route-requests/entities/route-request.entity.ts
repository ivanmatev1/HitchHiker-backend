import { Route } from "src/routes/entities/route.entity";
import { Users } from "src/user/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('routeRequests')
export class RouteRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Route, (route) => route.requests)
    route: Route

    @ManyToOne(() => Users, (user) => user.sendedRequests)
    sender: Users

    @ManyToOne(() => Users, (user) => user.receivedRequests)
    receiver: Users

    constructor(user: Partial<RouteRequest>) {
        Object.assign(this, user);
    }
}
