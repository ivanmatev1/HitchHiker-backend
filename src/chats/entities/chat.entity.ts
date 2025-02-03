import { Users } from "src/user/entities/user.entity";
import { PrimaryGeneratedColumn, Column, ManyToMany, Entity, JoinTable, OneToMany, OneToOne } from "typeorm";
import { Message } from "./messages.entity";
import { Route } from "src/routes/entities/route.entity";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Users, (user) => user.chats)
    participants: Users[];

    @OneToMany(() => Message, (message) => message.chat, { cascade: true, onDelete: 'CASCADE' })
    messages: Message[];

    @OneToOne(() => Route, (route) => route.chat)
    route: Route;

    constructor(user: Partial<Chat>) {
        Object.assign(this, user);
    }
}
