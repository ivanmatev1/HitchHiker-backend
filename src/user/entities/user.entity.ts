import { Route } from "src/routes/entities/route.entity";
import { Column, Entity, PrimaryGeneratedColumn, Unique, Check, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { providerType } from "../provider.enum";
import { Chat } from "src/chats/entities/chat.entity";
import { Message } from "src/chats/entities/messages.entity";

@Entity('users')
@Unique(['phone_number'])
@Unique(['email'])
export class Users {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    first_name: string;

    @Column()
    last_name: string;
    // only the date, no hours
    @Column({ type: 'date' })
    birthday: Date;

    @Column()
    email: string;

    @Column({ nullable: true })
    phone_number: string;

    @Column({default: false})
    verified_phone_number: boolean;

    @Column({default: false})
    verified_email: boolean;
    // Should be hashed in frontend
    @Column()
    password: string;
    // URL for photo
    @Column({ nullable: true })
    photo: string;

    @Column({type: 'enum', enum: providerType})
    provider: providerType;

    @ManyToMany(() => Route, (route) => route.participants, {cascade:true })
    @JoinTable()
    routes: Route[];

    @ManyToMany(() => Chat, (chat) => chat.participants, {cascade:true })
    @JoinTable()
    chats: Chat[];

    @OneToMany(() => Message, (message) => message.chat, {cascade: true})
    messages: Message[]; 

    @OneToMany(() => Route, (route) => route.creator, {cascade: true})
    createdRoutes: Route[]; 


    constructor(user: Partial<Users>){
        Object.assign(this, user);
    }
}
