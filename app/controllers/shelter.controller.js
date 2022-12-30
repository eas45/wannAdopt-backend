const db = require('../models');
const Shelter = db.shelters;
const ProfileController = require('../controllers/profile.controller');
// const Op = db.Sequelize.Op;

// Create and Save a new Shelter
exports.create = async (req, res) => {
  // Validate request
  if (!req.query.profile) {
    res.status(400).send({
      message: "Shelter must belong to a profile!"
    });
    return;
  }
  if (!req.body.cif) {
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
      const shelter = await profile.getShelter();
      if (shelter) {
        return res.status(404).send({
          message: 'This profile already has a shelter.'
        });
      }

      var user = await profile.getUser();
      if (user) {
        return res.status(404).send({
          message: 'This profile belongs to a user.'
        });
      }

      // Create a Shelter
      const newShelter = {
        cif: req.body.cif,
        name: req.body.name,
        city: req.body.city,
        type: req.body.type
      };

      const createdShelter = await profile.createShelter(newShelter);

      return res.status(201).send(createdShelter);
    }
    res.status(profileResponse.status).send(profileResponse.payload);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Shelter."
    });
  }
};

// Retrieve all Shelters from the database.
exports.findAll = (req, res) => {
  // const cif = req.query.cif;
  // var condition = cif ? { cif: { [Op.like]: `%${cif}%` } } : null;

  Shelter.findAll(/* { where: condition } */)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error ocurred while retrieving shelters."
      });
    });
};

// Find a single Shelter with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Shelter.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Shelter with id=${id}.`
        });
      }
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send({
        message: `Error retrieving Shelter with id=${id}.`
      });
    });
};

// Update a Shelter by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Shelter.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Shelter was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Shelter with id=${id}. Maybe Shelter was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating Shelter with id=${id}`
      });
    });
};

// Delete a Shelter with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Shelter.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Shelter was deleted successfully.'
        });
      } else {
        res.send({
          message: `Cannot delete Shelter with id=${id}. Maybe Shelter was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error deleting Shelter with id=${id}`
      });
    });
};

// Delete all Shelters from the database
exports.deleteAll = (req, res) => {
  Shelter.destroy({
    where: {},
    truncate: false
  })
    .then(num => {
      res.send({
        message: `${num} Shelter(s) were deleted succesfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error deleting Shelter with id=${id}`
      });
    });
};

// Find all shelter Shelters
exports.findAllShelters = (req, res) => {
  Shelter.findAll({
    include: ['user']
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message ||
          'Some error ocurred while retrieving all Shelter Shelters'
      });
    });
};

// Find all shelter Shelters
exports.findAllShelters = (req, res) => {
  Shelter.findAll({
    include: ['shelter']
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message ||
          'Some error ocurred while retrieving all Shelter Shelters'
      });
    });
};
