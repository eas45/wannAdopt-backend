const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const Profile = db.profiles;

// const { TokenExpiredError } = jwt;

// const catchError = (err, res) => {
//   if (err instanceof TokenExpiredError) {
//     return res.status(401).send({ message: 'La sesión ha expirado.' })
//   }

//   return res.status(401).send({ message: "No autorizado" });
// }

verifyToken = (req, res, next) => {
  // let token = req.session.token;
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: '¡La petición ha sido enviada sin token!'
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: '¡No autorizado!'
      });
      // return catchError(err, res);
    }
    req.email = decoded.email
    next();
  });
};

isUser = async (req, res, next) => {
  try {
    console.log(req.email);
    const profile = await Profile.findOne({
      where: {
        email: req.email
      }
    });
    console.log(profile);
    const user = await profile.getUser();

    if (user) {
      return next();
    }

    return res.status(403).send({
      message: 'Solo disponible para usuarios.'
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: 'Error validando usuario.'
    });
  }
}

isShelter = async (req, res, next) => {
  try {
    const profile = await Profile.findByPk(req.profileId);
    const shelter = await profile.getShelter();

    if (shelter) {
      return next();
    }

    return res.status(403).send({
      message: 'Solo disponible para refugios.'
    });
  } catch (err) {
    return res.status(500).send({
      message: 'Error validando refugio.'
    });
  }
}

const authJwt = {
  verifyToken,
  isUser,
  isShelter
};

module.exports = authJwt;