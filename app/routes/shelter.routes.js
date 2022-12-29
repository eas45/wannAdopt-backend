module.exports = app => {
  const shelters = require('../controllers/shelter.controller');

  var router = require('express').Router();

  // Create a new Profile
  router.post('/', shelters.create);

  // Retrieve all Profiles
  // router.get('/', profiles.findAll);

  // // Retrieve all User Profiles
  // router.get('/users', profiles.findAllUsers);

  // // Retrieve all Shelter Profiles
  // router.get('/shelters', profiles.findAllShelters);

  // // Retrieve a single Profile with id
  // router.get('/:id', profiles.findOne);

  // // Update a Profile with id
  // router.put('/:id', profiles.update);

  // // Delete a Profile with id
  // router.delete('/:id', profiles.delete);

  // // Delete all Profiles
  // router.delete('/', profiles.deleteAll);

  app.use('/api/shelters', router);
}