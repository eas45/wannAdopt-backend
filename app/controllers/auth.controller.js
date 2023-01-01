const db = require('../models');
const Profile = db.profiles;
const ProfileController = require('../controllers/profile.controller');

exports.register = async (req, res) => {
  console.log('Registro recibido');
  const profileResponse = await ProfileController._create(req);

  return res.status(profileResponse.status).send(profileResponse.payload);
}