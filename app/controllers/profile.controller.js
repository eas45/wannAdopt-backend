const db = require('../models');
const Profile = db.profiles;
const UserController = require('../controllers/user.controller');
const ShelterController = require('../controllers/shelter.controller');
const Op = db.Sequelize.Op;

const bcrypt = require('bcryptjs');

exports._create = async (req) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
    return;
  }

  // Create a Profile
  const newProfile = {
    email: req.body.email,
    // password: req.body.password,
    password: bcrypt.hashSync(req.body.password),
    salt: req.body.salt ? req.body.salt : undefined
  };

  try {
    const profile = await Profile.create(newProfile);

    return {
      status: 200,
      payload: profile
    }
  } catch (err) {
    return {
      status: 500,
      payload: {
        message: err.message || "Error creando el perfil."
      }
    }
  }
}

// Create and Save a new Profile
exports.create = async (req, res) => {
  const response = await this._create(req);

  return res.status(response.status).send(response.payload);
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
          err.message || "Error obteniendo los perfiles."
      });
    });
};

exports._findOne = async (id) => {
  try {
    var profile = await Profile.findByPk(id);
    const status = profile ? 200 : 404;
    var payload = profile ? profile : { message: `No se encontró el perfil con id=${id}.` };

    return {
      status,
      payload
    }
  } catch (err) {
    console.log(err.message);
    return {
      status: 500,
      payload: { message: `Error obteniendo el perfil con id=${id}.` }
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
    where: { id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Perfil actualizado con éxito.'
        });
      } else {
        res.send({
          message: `¡No se ha podido actualizar el perfil con id=${id}! Tal vez el perfil no se encontró o el cuerpo estaba vacío.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error actualizando el perfil con id=${id}`
      });
    });
};

exports._delete = async (id) => {
  try {
    const num = await Profile.destroy({
      where: { id }
    });

    return {
      status: 200,
      payload:
        num == 1 ?
          { message: 'Perfil eliminado con éxitos.' } :
          { message: `¡No se puede eliminar el perfil con id=${id}! Tal vez el perfil no se encontró o el cuerpo estaba vacío.` }
    }
  } catch (err) {
    return {
      status: 500,
      payload: {
        message: err.message || `Error eliminando el perfil con id=${id}`
      }
    }
  }
}

// Delete a Profile with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  const profileResponse = await this._findOne(id);

  if (profileResponse.status == 200) {
    const profile = profileResponse.payload;

    const user = await profile.getUser();
    if (user) {
      // Borra User
      const userResponse = await UserController._delete(user.id);

      if (userResponse.status != 200) {
        return res.status(userResponse.status).send(userResponse.payload)
      }
      console.log(userResponse.payload);
    }

    const shelter = await profile.getShelter();
    if (shelter) {
      // Borra Shelter
      const shelterResponse = await ShelterController._delete(shelter.id);

      if (shelterResponse.status != 200) {
        return res.status(shelterResponse.status).send(shelterResponse.payload)
      }
      console.log(shelterResponse.payload);
    }

    const response = await this._delete(id);

    return res.status(response.status).send(response.payload);
  }

  res.status(profileResponse.status).send(profileResponse.payload);
};

// Delete all Profiles from the database
exports.deleteAll = (req, res) => {
  Profile.destroy({
    where: {},
    truncate: false
  })
    .then(num => {
      res.send({
        message: `${num} perfil(es) eliminado(s) con éxito`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error eliminando el perfil con id=${id}`
      });
    });
};

// exports._findAllUsers = async () => {
//   try {
//     var payload =
//       await Profile.findAll({
//         include: ['user']
//       });

//     return {
//       status: 200,
//       payload: payload.filter(profile => profile.user)
//     };
//   } catch (err) {
//     return {
//       status: 500,
//       payload: {
//         message: err.message ||
//           'Some error ocurred while retrieving all User Profiles'
//       }
//     };
//   }
// }

// Find all user Profiles
exports.findAllUsers = async (req, res) => {
  // const response = await this._findAllUsers();

  // return res.status(response.status).send(response.payload);
  Profile.findAll({
    include: ['user']
  })
    .then(data => {
      res.send(data.filter(d => d.user));
    })
    .catch(err => {
      res.status(500).send({
        message: err.message ||
          'Error obteniendo los perfiles de los usuarios.'
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
          'Error obteniendo los perfiles de los refugios.'
      });
    });
};