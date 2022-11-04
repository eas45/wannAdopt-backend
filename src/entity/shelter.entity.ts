import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { ShelterType } from './shelterType.entity';

@Entity()
export class Shelter {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    adress: string

    @OneToOne(() => Profile, (profile) => profile.shelter)
    @JoinColumn()
    profile: Profile

    @ManyToOne(() => ShelterType, (shelterType) => shelterType.shelters)
    type: ShelterType

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date

    @DeleteDateColumn()
    deletedDate: Date

}
