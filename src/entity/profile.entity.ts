import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { User } from './user.entity';
import { Shelter } from './shelter.entity';

@Entity()
@Unique(["nickname"])
export class Profile {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nickname: string

    @Column()
    password: string

    @Column()
    salt: string

    @OneToOne(() => User, { nullable: true })
    user: User

    @OneToOne(() => Shelter, { nullable: true })
    shelter: Shelter

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date

    @DeleteDateColumn()
    deletedDate: Date

}
