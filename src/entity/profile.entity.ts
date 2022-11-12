import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { User } from './user.entity';
import { Shelter } from './shelter.entity';

@Entity()
@Unique(["nickname"])
export class Profile /* extends BaseEntity */ {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nickname: string

    @Column()
    password: string

    @Column({ default: 'none' })
    salt: string

    @OneToOne(() => User, { nullable: true })
    @JoinColumn()
    user: User

    @OneToOne(() => Shelter, { nullable: true })
    @JoinColumn()
    shelter: Shelter;

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date

    @DeleteDateColumn()
    deletedDate: Date

}
