const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require('helmet');
const db = require("./app/models");
const cookieSession = require("cookie-session");

const dotenv = require('dotenv');
dotenv.config();

const app = express();

var corsOptions = {
  credentials: true,
  origin: [
    'http://localhost:4200',
    'http://localhost:8100'
  ]
};

app.use(cors(corsOptions));
app.use(morgan('tiny'));
app.use(helmet());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: 'profile-session',
    secret: process.env.COOKIE_SECRET,
    httpOnly: true
  })
)

db.sequelize.sync(/* { force: true } */)
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// simple route
app.get("/", (req, res) => {
  // const Profile = db.profiles;
  // const User = db.users;

  // const profile = {
  //   email: 'a@a.com',
  //   password: 'pass'
  // }

  // const user = {
  //   name: 'prueba',
  //   profileId: 1
  // }

  // Profile.create(profile)
  //   .then(data => {
  //     // res.send(data);
  //   })
  //   .catch(err => {
  //     res.json({ message: 'Error: ' + err.message });
  //   })

  // User.create(user)
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(() => {
  //     res.json({ message: 'Error: ' + err.message });
  //   })

  // Profile.findByPk(1, { include: ['user'] })
  //   .then((profile) => {
  //     res.send(profile);
  //   })

  // User.findByPk(1, { include: ['profile'] })
  //   .then((user) => {
  //     res.send(user);
  //   })

  // Profile.destroy({
  //   where: {
  //     id: 1
  //   }
  // }).then(() => {
  //   res.send('OK');
  // });

  // Profile.restore();

  res.json({ message: 'Welcome to bezkoder application.' });

});

require('./app/routes/auth.routes')(app);
require('./app/routes/profile.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/shelter.routes')(app);
require('./app/routes/animal.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
