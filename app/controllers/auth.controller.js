const db = require('../models');
const Profile = db.profiles;
const ProfileController = require('../controllers/profile.controller');

exports.register = async (req, res) => {
  const profileResponse = await ProfileController._create(req);

  return res.status(profileResponse.status).send({ email: profileResponse.payload.email });
}

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
      where: { email, password }
    });

    return profile ?
      res.send({ message: 'Guay' }) :
      res.status(404).send({ message: 'Credenciales incorrectas.' });
  } catch (err) {
    console.log(err.message);

    return res.status(500).send({
      message: 'No se pudo iniciar sesión. Por favor, inténtelo más tarde.'
    });
  }
}
