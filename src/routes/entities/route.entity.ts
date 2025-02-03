import { Entity, Column, PrimaryGeneratedColumn, Check, ManyToMany, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "src/user/entities/user.entity";
import { RouteStop } from "./routeStop.entity";
import { Chat } from "src/chats/entities/chat.entity";
import { RouteRequest } from "src/route-requests/entities/route-request.entity";

Check('"seats">0')
@Entity('routes')
export class Route {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => RouteStop, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    start_location: RouteStop;

    @OneToOne(() => RouteStop, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    end_location: RouteStop;

    @OneToMany(() => RouteStop, (routeStop) => routeStop.route, { cascade: true, onDelete: 'CASCADE' })
    stops: RouteStop[];

    // date with hours
    @Column({ type: 'timestamp' })
    date: Date;

    @Column({ default: false })
    completed: boolean;

    @Column()
    passangers: number;

    @ManyToMany(() => Users, (user) => user.routes)
    participants: Users[];

    @ManyToOne(() => Users, (creator) => creator.createdRoutes)
    creator: Users;

    @OneToOne(() => Chat, (chat) => chat.route, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    chat: Chat;

    @OneToMany(() => RouteRequest, (request) => request.route, { cascade: true, onDelete: 'CASCADE' })
    requests: RouteRequest[];

    constructor(user: Partial<Route>) {
        Object.assign(this, user);
    }
}
