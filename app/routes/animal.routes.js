const { authJwt } = require('../middleware');

module.exports = app => {
  const animals = require('../controllers/animal.controller');

  var router = require('express').Router();

  // Create a new Animal
  router.post('/', [authJwt.verifyToken], animals.create);

  // Retrieve all Animals
  router.get('/', animals.findAll);
  
  // Retrieve shelter animals
  router.get('/shelter', [authJwt.verifyToken, authJwt.isShelter], animals.findAllByShelter);

  router.get('/:id/requests', [authJwt.verifyToken, authJwt.isShelter], animals.findAnimalResquests);

  // Retrieve a single Animal with id
  router.get('/:id', animals.findOne);

  // Update a Animal with id
  router.put('/:id', [authJwt.verifyToken, authJwt.isShelter], animals.update);

  // Delete a Animal with id
  router.delete('/:id', [authJwt.verifyToken, authJwt.isShelter], animals.delete);

  // Delete all Animals
  // router.delete('/', animals.deleteAll);

  app.use('/api/animals', router);
}