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

exports._findOne = async (id) => {
  try {
    var shelter = await Shelter.findByPk(id);
    const status = shelter ? 200 : 404;
    var payload = shelter ? shelter : { message: `Cannot find Shelter with id=${id}.` };

    return {
      status,
      payload
    }
  } catch (err) {
    console.log(err.message);
    return {
      status: 500,
      payload: { message: `Error retrieving Shelter with id=${id}.` }
    };
  }
}

// Find a single Shelter with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  const response = await this._findOne(id);

  return res.status(response.status).send(response.payload);
};

// Update a Shelter by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Shelter.update(req.body, {
    where: { id }
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

exports._delete = async (id) => {
  try {
    const num = Shelter.destroy({
      where: { id }
    });

    return {
      status: 200,
      payload:
        num == 1 ?
          { message: 'Shelter was deleted successfully.' } :
          { message: `Cannot delete Shelter with id=${id}. Maybe Shelter was not found or req.body is empty!` }
    }
  } catch (err) {
    console.log(err.message);
    return {
      status: 500,
      payload: { message: `Error deleting Shelter with id=${id}` }
    }
  }
}

// Delete a Shelter with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  const shelterResponse = await this._findOne(id);
  
  if (shelterResponse.status == 200) {
    const shelter = shelterResponse.payload;
    const profileId = shelter.profileId;
    const profileResponse = await ProfileController._delete(profileId);

    if (profileResponse.status == 200) {
      Shelter.destroy({
        where: { id }
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
      return;
    }

    return res.status(profileResponse.status).send(profileResponse.payload);
  }

  res.status(shelterResponse.status).send(shelterResponse.payload);
};

// // Delete all Shelters from the database
// exports.deleteAll = (req, res) => {
//   Shelter.destroy({
//     where: {},
//     truncate: false
//   })
//     .then(num => {
//       res.send({
//         message: `${num} Shelter(s) were deleted succesfully!`
//       });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: err.message || `Error deleting Shelter with id=${id}`
//       });
//     });
// };
