import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1234",
    database: "tfg",
    entities: ["src/entity/**/*.ts"],
    logging: true,
    logger: "file",
    synchronize: true
})