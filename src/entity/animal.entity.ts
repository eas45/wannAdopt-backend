import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Animal {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    breed: string

    @Column()
    age: number

    @Column()
    sex: string

    @Column()
    energy: string

    @Column()       // muy pequeño - pequeño / - mediano / - largo / No importa
    size: string

    @Column()       // terso - corto / - mediano / - largo / No importa
    hair: string

}
