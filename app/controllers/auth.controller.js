const db = require('../models');
const Profile = db.profiles;
const ProfileController = require('../controllers/profile.controller');
const config = require('../config/auth.config');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const profileResponse = await ProfileController._create(req);

  return res.status(profileResponse.status).send({ email: profileResponse.payload.email });
};

exports.login = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({
      message: 'Se necesita el usuario y la contraseña para poder iniciar sesión.'
    });
  }

  const email = req.body.email;
  const password = req.body.password;
  
  try {
    const profile = await Profile.findOne({
      where: { email }
    });

    if (!profile) {
      return res.status(404).send({
        message: 'Correo electrónico no encontrado.'
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      password, profile.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: 'Contraseña incorrecta.'
      })
    }

    const token = jwt.sign({ id: profile.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    req.session.token = token;

    return res.send({
      id: profile.id,
      email: profile.email
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
    req.session = null;
    return res.send({
      message: 'Sesión cerrada.'
    });
  } catch (err) {
    this.next(err);
  }
};
