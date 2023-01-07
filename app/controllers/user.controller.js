const db = require('../models');
const User = db.users;
// const Profile = db.profiles;
const ProfileController = require('../controllers/profile.controller');
const AnimalController = require('../controllers/animal.controller');
const AnimalUsers = db.animal_users;
// const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (!req.query.profile) {
    res.status(400).send({
      message: "User must belong to a profile!"
    });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const profileId = req.query.profile;

  try {
    const profileResponse = await ProfileController._findOne(profileId);

    if (profileResponse.status == 200) {
      const profile = profileResponse.payload;
      const user = await profile.getUser();
      if (user) {
        return res.status(404).send({
          message: 'This profile already has a user.'
        });
      }

      var shelter = await profile.getShelter();
      if (shelter) {
        return res.status(404).send({
          message: 'This profile belongs to a shelter.'
        });
      }

      // Create a User
      const newUser = {
        name: req.body.name,
        firstSurname: req.body.firstSurname,
        secondSurname: req.body.secondSurname,
        dateOfBirth: req.body.dateOfBirth
      };

      const createdUser = await profile.createUser(newUser);

      return res.status(201).send(createdUser);
    }
    res.status(profileResponse.status).send(profileResponse.payload);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the User."
    });
  }
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  // const name = req.query.name;
  // var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  User.findAll(/* { where: condition } */)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error ocurred while retrieving users."
      });
    });
};

exports._findOne = async (id) => {
  try {
    const user = await User.findByPk(id);

    return {
      status: user ? 200 : 404,
      payload: user ? user : { message: `Cannot find User with id=${id}.` }
    };
  } catch (err) {
    console.log(err.message);
    return {
      status: 500,
      payload: { message: `Error retrieving User with id=${id}.` }
    };
  }
}

// Find a single User with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  const response = await this._findOne(id);

  res.status(response.status).send(response.payload);
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'User was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating User with id=${id}`
      });
    });
};

exports._delete = async (id) => {
  try {
    const num = User.destroy({
      where: { id }
    });

    return {
      status: 200,
      payload:
        num == 1 ?
          { message: 'User was deleted successfully.' } :
          { message: `Cannot delete User with id=${id}. Maybe User was not found or req.body is empty!` }
    }
  } catch (err) {
    console.log(err.message);
    return {
      status: 500,
      payload: { message: `Error deleting User with id=${id}` }
    }
  }
}

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  const userResponse = await this._findOne(id);

  if (userResponse.status == 200) {
    const user = userResponse.payload;
    const profileId = user.profileId;
    const profileResponse = await ProfileController._delete(profileId);

    if (profileResponse.status == 200) {
      User.destroy({
        where: { id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: 'User was deleted successfully.'
            });
          } else {
            res.send({
              message: `Cannot delete User with id=${id}. Maybe User was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: `Error deleting User with id=${id}`
          });
        });
      return;
    }

    return res.status(profileResponse.status).send(profileResponse.payload);
  }

  res.status(userResponse.status).send(userResponse.payload);
};

// // Delete all Users from the database
// exports.deleteAll = (req, res) => {
//   User.destroy({
//     where: {},
//     truncate: false
//   })
//     .then(num => {
//       res.send({
//         message: `${num} User(s) were deleted succesfully!`
//       });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: err.message || `Error deleting User with id=${id}`
//       });
//     });
// };

exports.linkWithAnimal = async (req, res) => {
  try {
    const response = await this._findOne(req.accountId);

    if (response.status == 200) {
      const { payload: user } = response;
      const { id: animalId } = req.params;
      const animalResponse = await AnimalController._findOne(animalId);

      // console.log(animalResponse);

      if (animalResponse.status == 200) {
        const { payload: animal } = animalResponse;
        console.log(animal)
        await user.addAnimal(animal);

        return res.send({
          message: 'Vinculación con el animal correcta.',
          payload: {
            user: req.accountId,
            animal: animalId
          }
        });
      }
      return res.status(400).send({
        message: `Error obteniendo el animal con id=${animalId}.`
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: 'Error vinculando con el animal.'
    });
  }
};

exports.findAllAnimals = async (req, res) => {
  const user = await User.findByPk(req.accountId);
  const animals = await user.getAnimals();

  res.send(animals);
}
