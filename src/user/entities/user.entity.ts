import { Column, Entity, PrimaryGeneratedColumn, Unique, Check } from "typeorm";

@Entity('users')
@Unique(['phone_number'])
@Unique(['email'])
@Check('email ~* \'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\'')
@Check('phone_number ~* \'^\\+?[1-9][0-9]{7,14}$\'')
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

    constructor(user: Partial<Users>){
        Object.assign(this, user);
    }
}
