// import { Shelter } from './entity/shelter.entity';
import * as express from "express";
import { Request, Response } from "express";
import { Profile } from "./entity/profile.entity";
import { myDataSource } from "./app-data-source";
import * as cors from 'cors';
import * as morgan from 'morgan';

// establish database connection
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// create and setup express app
const app = express();
app.use(express.json());

const allowedOrigins = ['http://localhost:8100'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));
app.use(morgan('tiny'));

// login routes
app.post('/signin', async function (req: Request, res: Response) {
  const nickname = req.body.nickname;
  const password = req.body.password;

  const newProfile = new Profile();
  newProfile.nickname = nickname;
  newProfile.password = password;
  await myDataSource.getRepository(Profile).save(newProfile);

  const savedProfile = await myDataSource.getRepository(Profile).findBy({ nickname });

  res.json({
    message: 'Done',
    DBresutl: savedProfile
  });
});

app.post("/login", async function (req: Request, res: Response) {
  const nickname = req.body.nickname;
  const password = req.body.password;

  const profile = await myDataSource.getRepository(Profile).findBy({ nickname, password });

  res.json({
    message: "Done",
    profile
  });
});

// Consultar todos
app.get("/users", async function (req: Request, res: Response) {
  const users = await myDataSource.getRepository(Profile).find()
  res.json(users)
})

// Crear usuario
app.post("/users", async function (req: Request, res: Response) {
  const user = await myDataSource.getRepository(Profile).create(req.body)
  try {
    const results = await myDataSource.getRepository(Profile).save(user)
    console.log("User created!")
    return res.send(results)
  }
  catch (ex) {
    console.error("Exception:", ex.sqlMessage)
    return res.send(ex)
  }
})

// Modificar usuario
app.put("/users/:nickname", async function (req: Request, res: Response) {
  const nicknameParam = req.params.nickname
  try {
    const result = await myDataSource.getRepository(Profile).update({ nickname: nicknameParam }, req.body)
    console.log("User updated!")
    return res.send(result)
  } catch (ex) {
    console.error("Exception:", ex.sqlMessage)
    return res.send(ex)
  }
})

// Borrar usuario
app.post("/users/:nickname", async function (req: Request, res: Response) {
  const nicknameParam = req.params.nickname
  try {
    const result = await myDataSource.getRepository(Profile).softDelete({ nickname: nicknameParam })
    console.log("User deleted!")
    return res.send(result)
  } catch (ex) {
    console.error("Exception:", ex.sqlMessage)
    return res.send(ex)
  }
})

// app.get("/shelters", async function (req: Request, res: Response) {
//     const shelters = await myDataSource.getRepository(Shelter).find()
//     res.json(shelters)
// })

// app.post("/shelter", async function (req: Request, res: Response) {
//     const shelter = await myDataSource.getRepository(Shelter).create(req.body)
//     try {
//         const result = await myDataSource.getRepository(Shelter).save(shelter)
//         console.log("Shelter created!")
//         return res.send(result)
//     } catch (ex) {
//         console.error("Exception:", ex.sqlMessage)
//         return res.send(ex)
//     }
// })

app.listen(3000, () => {
  console.log("Server is up!")
})