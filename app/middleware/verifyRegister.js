const db = require('../models');
const Profile = db.profiles;

checkDuplicateEmail = async (req, res, next) => {
  try {
    let email = await Profile.findOne({
      where: {
        email: req.body.email
      }
    });

    if (email) {
      return res.status(400).send({
        message: '¡Error! Ya se ha registrado este correo electrónico.'
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: 'Error comprobando correo electrónico.'
    });
  }
}

const verifyRegister = {
  checkDuplicateEmail
}

module.exports = verifyRegister;