const express = require("express");
const cors = require("cors");
const db = require("./app/models");

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

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

require("./app/routes/profile.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
