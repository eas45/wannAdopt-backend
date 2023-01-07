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
  let token = req.headers['authorization']
    ? req.headers['authorization'].split(' ')[1]
    : null;

  if (!token) {
    return res.status(403).send({
      message: '¡La petición ha sido enviada sin token!'
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({
        token,
        message: '¡Token no autorizado!'
      });
      // return catchError(err, res);
    }
    req.accountId = decoded.id;
    req.role = decoded.role;
    console.log(`VERIFICADO: ${req.role} con id=${req.accountId}`);
    next();
  });
};

isUser = async (req, res, next) => {
  return req.role == 'user' ?
    next() :
    res.status(403).send({
      message: 'Cuenta sin privilegios requeridos.'
    });
}

isShelter = async (req, res, next) => {
  return req.role == 'shelter' ?
    next() :
    res.status(403).send({
      message: 'Cuenta sin privilegios requeridos.'
    });
}

const authJwt = {
  verifyToken,
  isUser,
  isShelter
};

module.exports = authJwt;