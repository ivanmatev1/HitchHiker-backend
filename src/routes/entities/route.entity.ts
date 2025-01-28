import { Entity, Column, PrimaryGeneratedColumn, Check, ManyToMany, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "src/user/entities/user.entity";
import { RouteStop } from "./routeStop.entity";
import { Chat } from "src/chats/entities/chat.entity";

Check('"seats">0')
@Entity('routes')
export class Route {
    @PrimaryGeneratedColumn()
    id: number;
    
    @OneToOne(() => RouteStop,  {cascade: true})
    @JoinColumn()
    start_location: RouteStop;

    @OneToOne(() => RouteStop, {cascade: true})
    @JoinColumn()
    end_location: RouteStop;

    @OneToMany(() => RouteStop, (routeStop) => routeStop.route, {cascade: true})
    stops: RouteStop[];

    // date with hours
    @Column({ type: 'timestamp' })
    date: Date;

    @Column({default: false})
    completed: boolean;
    
    @Column()
    passangers: number;

    @ManyToMany(() => Users, (user) => user.routes)
    participants: Users[];

    @ManyToOne(() => Users, (creator) => creator.createdRoutes)
    creator: Users;

    @OneToOne(() => Chat ,{cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    chat: Chat;

    constructor(user: Partial<Route>){
        Object.assign(this, user);
    }
}
