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
          err.message || "Some error ocurred while retrieving profiles."
      });
    });
};

exports._findOne = async (id) => {
  try {
    var profile = await Profile.findByPk(id);
    const status = profile ? 200 : 404;
    var payload = profile ? profile : { message: `Cannot find Profile with id=${id}.` };

    return {
      status,
      payload
    }
  } catch (err) {
    console.log(err.message);
    return {
      status: 500,
      payload: { message: `Error retrieving Profile with id=${id}.` }
    };
  }
}

// Find a single Profile with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  const response = await this._findOne(id);

  res.status(response.status).send(response.payload);
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

exports._findAllUsers = async () => {
  try {
    const payload =
      await Profile.findAll({
        include: ['user']
      })
      .filter(profile => profile.user);

    return {
      status: 200,
      payload
    };
  } catch (err) {
    return {
      status: 500,
      payload: {
        message: err.message ||
          'Some error ocurred while retrieving all User Profiles'
      }
    };
  }
}

// Find all user Profiles
exports.findAllUsers = (req, res) => {
  Profile.findAll({
    include: ['user']
  })
    .then(data => {
      res.send(data.filter(d => d.user));
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
    include: ['shelter']
  })
    .then(data => {
      res.send(data.filter(d => d.shelter));
    })
    .catch(err => {
      res.status(500).send({
        message: err.message ||
          'Some error ocurred while retrieving all Shelter Profiles'
      });
    });
};