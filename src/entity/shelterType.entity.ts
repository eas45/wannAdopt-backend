import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Shelter } from "./shelter.entity";

@Entity()
@Unique(["type"])
export class ShelterType {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @Column()
    description: string

    @OneToMany(() => Shelter, (shelter) => shelter.type)
    shelters: Shelter[]
    
    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date

    @DeleteDateColumn()
    deletedDate: Date

}
