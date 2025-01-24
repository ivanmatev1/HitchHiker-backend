import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { Users } from "src/user/entities/user.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column({ type: 'timestamp' })
    timestamp: Date

    @ManyToOne(() => Chat, (chat) => chat.messages)
    chat: Chat

    @ManyToOne(() => Users, (user) => user.messages)
    sender: Users

    constructor(user: Partial<Message>) {
        Object.assign(this, user);
    }
}