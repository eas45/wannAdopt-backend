const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const Profile = db.Profile;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: '¡No autorizado!'
      });
    }
    req.profileId = decoded.id;
    next();
  });
};

isUser = async (req, res, next) => {
  try {
    const profile = await Profile.findByPk(req.profileId);
    const user = await profile.getUser();

    if (user) {
      return next();
    }

    return res.status(403).send({
      message: 'Solo disponible para usuarios.'
    });
  } catch (err) {
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