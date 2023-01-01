const db = require('../models');
const Profile = db.profiles;
const ProfileController = require('../controllers/profile.controller');

exports.register = async (req, res) => {
  const profileResponse = await ProfileController._create(req);

  return res.status(profileResponse.status).send(profileResponse.payload);
}