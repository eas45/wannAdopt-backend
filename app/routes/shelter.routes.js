const authJwt = require('../middleware/authJwt');

module.exports = app => {
  const shelters = require('../controllers/shelter.controller');

  var router = require('express').Router();

  // Create a new Shelter
  router.post('/', shelters.create);

  // Retrieve all Shelters
  router.get('/', shelters.findAll);

  // Retrieve a single Shelter with id
  router.get('/:id', [authJwt.verifyToken, authJwt.isShelter], shelters.findOne);

  // Update a Shelter with id
  router.put('/:id', [authJwt.verifyToken, authJwt.isShelter], shelters.update);

  // Delete a Shelter with id
  router.delete('/:id', [authJwt.verifyToken, authJwt.isShelter], shelters.delete);

  // // Delete all Shelters
  // router.delete('/', shelters.deleteAll);

  app.use('/api/shelters', router);
}
