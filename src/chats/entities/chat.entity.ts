import { Users } from "src/user/entities/user.entity";
import { PrimaryGeneratedColumn, Column, ManyToMany, Entity, JoinTable, OneToMany } from "typeorm";
import { Message } from "./messages.entity";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Users, (user) => user.chats)
    participants: Users[];

    @OneToMany(() => Message, (message) => message.chat, {cascade: true})
    messages: Message[]; 

    constructor(user: Partial<Chat>){
        Object.assign(this, user);
    }
}
