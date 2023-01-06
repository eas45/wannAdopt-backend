const db = require('../models');
const Profile = db.profiles;
const ProfileController = require('../controllers/profile.controller');
const authConfig = require('../config/auth.config');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const profileResponse = await ProfileController._create(req);

  return res.status(profileResponse.status).send({ email: profileResponse.payload.email });
};

// Create a token
newToken = (id, rol) => {
  const token = jwt.sign(
    {
      id, // User or Shelter ID
      rol
    },
    authConfig.secret,
    // { expiresIn: authConfig.jwtExpiration }
  );

  return token;
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).send({
      message: 'Se necesita el usuario y la contraseña para poder iniciar sesión.'
    });
  }

  try {
    const profile = await Profile.findOne({
      where: { email }
    });

    if (profile) {
      const passwordIsValid = bcrypt.compareSync(
        password, profile.password
      );

      if (passwordIsValid) {
        const dataAccount = await ProfileController._findAccountByEmail(email);
        console.log(dataAccount);
        const token = newToken(dataAccount.data.id, dataAccount.rol);

        return res.send({ token });
      }
    }

    return res.status(404).send({
      message: 'Credenciales incorrectas.'
    });

  } catch (err) {
    console.log(err.message);

    return res.status(500).send({
      message: 'No se pudo iniciar sesión. Por favor, inténtelo más tarde.'
    });
  }
};

exports.logout = async (req, res) => {
  try {
    return res.send({
      message: 'Sesión cerrada.'
    });
  } catch (err) {
    this.next(err);
  }
};
