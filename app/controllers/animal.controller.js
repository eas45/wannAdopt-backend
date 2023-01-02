const db = require('../models');
const Animal = db.animals;
const ShelterController = require('../controllers/shelter.controller');
const Op = db.Sequelize.Op;

// Create and Save a new Animal
exports.create = async (req, res) => {
  // Validate request
  if (!req.query.shelter) {
    res.status(400).send({
      message: "Animals must belong to a shelter!"
    });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const shelterId = req.query.shelter;

  try {
    const shelterResponse = await ShelterController._findOne(shelterId);

    if (shelterResponse.status == 200) {
      const shelter = shelterResponse.payload;
      // Create an Animal
      const newAnimal = {
        name: req.body.name,
        breed: req.body.breed,
        age: req.body.age,
        sex: req.body.sex,
        energy: req.body.energy,
        size: req.body.size,
        hair: req.body.hair
      };
      const createdAnimal = await shelter.createAnimal(newAnimal);

      return res.status(201).send(createdAnimal);
    }

    res.status(shelterResponse.status).send(shelterResponse.payload);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Animal."
    });
  }
  return;
};

// Retrieve all Animals from the database.
exports.findAll = (req, res) => {
  // const name = req.query.name;
  // var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Animal.findAll(/* { where: condition } */)
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

exports._findOne = async (id) => {
  try {
    var animal = await Animal.findByPk(id);
    const status = animal ? 200 : 404;
    var payload = animal ? animal : { message: `Cannot find Animal with id=${id}.` };

    return {
      status,
      payload
    }
  } catch (err) {
    console.log(err.message);
    return {
      status: 500,
      payload: { message: `Error retrieving Animal with id=${id}.` }
    };
  }
}

// Find a single Animal with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  const response = await this._findOne(id);

  res.status(response.status).send(response.payload);
};

// Update a Animal by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Animal.update(req.body, {
    where: { id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Animal was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Animal with id=${id}. Maybe Animal was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating Animal with id=${id}`
      });
    });
};

// Delete a Animal with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Animal.destroy({
    where: { id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Animal was deleted successfully.'
        });
      } else {
        res.send({
          message: `Cannot delete Animal with id=${id}. Maybe Animal was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error deleting Animal with id=${id}`
      });
    });
};

// Delete all Animals from the database
exports.deleteAll = (req, res) => {
  Animal.destroy({
    where: {},
    truncate: false
  })
    .then(num => {
      res.send({
        message: `${num} Animal(s) were deleted succesfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error deleting Animal with id=${id}`
      });
    });
};

// // Find all user Animals
// exports.findAllUsers = (req, res) => {
//   Animal.findAll({
//     include: ['user']
//   })
//     .then(data => {
//       res.send(data.filter(d => d.user));
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: err.message ||
//           'Some error ocurred while retrieving all User Animals'
//       });
//     });
// };

// // Find all shelter Animals
// exports.findAllShelters = (req, res) => {
//   Animal.findAll({
//     include: ['shelter']
//   })
//     .then(data => {
//       res.send(data.filter(d => d.shelter));
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: err.message ||
//           'Some error ocurred while retrieving all Shelter Animals'
//       });
//     });
// };
