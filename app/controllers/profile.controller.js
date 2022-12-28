const db = require('../models');
const Profile = db.profiles;
const Op = db.Sequelize.Op;

// Create and Save a new Profile
exports.create = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Profile
  const profile = {
    email: req.body.email,
    password: req.body.password,
    salt: req.body.salt ? req.body.salt : undefined
  };

  console.log("PROFILE:");
  console.log(profile);

  // Save Profile in the database
  Profile.create(profile)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Profile."
      });
    });
};

// Retrieve all Profiles from the database.
exports.findAll = (req, res) => {
  const email = req.query.email;
  var condition = email ? { email: { [Op.like]: `%${email}%` } } : null;

  Profile.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error ocurred while retrieving animals."
      });
    });
};

// Find a single Profile with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Profile.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Profile with id=${id}.`
        });
      }
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send({
        message: `Error retrieving PRofile with id=${id}.`
      });
    });
};

// Update a Profile by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Profile.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Profile was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Profile with id=${id}. Maybe Profile was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating Profile with id=${id}`
      });
    });
};

// Delete a Profile with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Profile.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Profile was deleted successfully.'
        });
      } else {
        res.send({
          message: `Cannot delete Profile with id=${id}. Maybe Profile was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error deleting Profile with id=${id}`
      });
    });
};

// Delete all Profiles from the database
exports.deleteAll = (req, res) => {
  Profile.destroy({
    where: {},
    truncate: false
  })
    .then(num => {
      res.send({
        message: `${num} Profile(s) were deleted succesfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error deleting Profile with id=${id}`
      });
    });
};

// Find all user Profiles
exports.findAllUsers = (req, res) => {
  Profile.findAll({
    where: { shelterId: null }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message ||
          'Some error ocurred while retrieving all User Profiles'
      });
    });
};

// Find all shelter Profiles
exports.findAllShelters = (req, res) => {
  Profile.findAll({
    where: { UserId: null }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message ||
          'Some error ocurred while retrieving all Shelter Profiles'
      });
    });
};