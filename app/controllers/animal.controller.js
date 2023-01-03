const db = require('../models');
const Animal = db.animals;
const ShelterController = require('../controllers/shelter.controller');
const Op = db.Sequelize.Op;

// Create and Save a new Animal
exports.create = async (req, res) => {
  // Validate request
  if (!req.query.shelter) {
    res.status(400).send({
      message: "Los animales deben pertenecer a un refugio."
    });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
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
        err.message || "Error creando el animal en la base de datos."
    });
  }
  return;
};

// Retrieve all Animals from the database.
exports.findAll = (req, res) => {
  Animal.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error obteniendo los animales."
      });
    });
};

exports._findOne = async (id) => {
  try {
    var animal = await Animal.findByPk(id);
    const status = animal ? 200 : 404;
    var payload = animal ? animal : { message: `No se encontró el animal con id=${id}.` };

    return {
      status,
      payload
    }
  } catch (err) {
    console.log(err.message);
    return {
      status: 500,
      payload: { message: `Error obteniendo el animal con id=${id}.` }
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
          message: 'Animal actualizado con éxito.'
        });
      } else {
        res.send({
          message: `¡No se ha podido actualizar el animal con id=${id}! Tal vez el animal no se encontró o el cuerpo estaba vacío.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error actualizando el animal con id=${id}`
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
          message: 'Animal eliminado con éxito.'
        });
      } else {
        res.send({
          message: `¡No se ha podido eliminar el animal con id=${id}! Tal vez el animal no se encontró o el cuerpo estaba vacío.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error eliminando el animal con id=${id}`
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
        message: `${num} animal(es) eliminado(s) con éxito`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error eliminando el animal con id=${id}`
      });
    });
};
