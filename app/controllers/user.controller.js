// const db = require('../models');
// const User = db.users;
// const Profile = db.profiles;
const ProfileController = require('../controllers/profile.controller');
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
/* 
// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const email = req.query.email;
  var condition = email ? { email: { [Op.like]: `%${email}%` } } : null;

  User.findAll({ where: condition })
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

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send({
        message: `Error retrieving User with id=${id}.`
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id }
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

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
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
};

// Delete all Users from the database
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(num => {
      res.send({
        message: `${num} User(s) were deleted succesfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error deleting User with id=${id}`
      });
    });
};

// Find all user Users
exports.findAllUsers = (req, res) => {
  User.findAll({
    include: ['user']
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message ||
          'Some error ocurred while retrieving all User Users'
      });
    });
};

// Find all shelter Users
exports.findAllShelters = (req, res) => {
  User.findAll({
    include: ['shelter']
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message ||
          'Some error ocurred while retrieving all Shelter Users'
      });
    });
};
 */