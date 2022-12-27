import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email:string

    @Column({ nullable: true })
    name: string

    @Column({ nullable: true })
    firstSurname: string

    @Column({ nullable: true })
    secondSurname: string

    @Column({ nullable: true })
    dateOfBirth: Date

    @OneToOne(() => Profile, (profile) => profile.user)
    @JoinColumn()
    profile: Profile

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date

    @DeleteDateColumn()
    deletedDate: Date

}
