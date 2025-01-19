import { Route } from "src/routes/entities/route.entity";
import { Column, Entity, PrimaryGeneratedColumn, Unique, Check, ManyToMany } from "typeorm";
import { providerType } from "../provider.enum";

@Entity('users')
@Unique(['phone_number'])
@Unique(['email'])
export class Users {
    @PrimaryGeneratedColumn()
    id: number;
    // Data validations will be done in the frontend
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

    @ManyToMany(() => Route, (route) => route.users, {cascade:true })
    routes: Route[];

    constructor(user: Partial<Users>){
        Object.assign(this, user);
    }
}
