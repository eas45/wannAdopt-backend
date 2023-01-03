const { authJwt } = require('../middleware');

module.exports = app => {
  const animals = require('../controllers/animal.controller');

  var router = require('express').Router();

  // Create a new Animal
  router.post('/', [authJwt.verifyToken], animals.create);

  // Retrieve all Animals
  router.get('/', animals.findAll);

  // // Retrieve all User Animals
  // router.get('/users', animals.findAllUsers);

  // // Retrieve all Shelter Animals
  // router.get('/shelters', animals.findAllShelters);

  // Retrieve a single Animal with id
  router.get('/:id', animals.findOne);

  // Update a Animal with id
  router.put('/:id', animals.update);

  // Delete a Animal with id
  router.delete('/:id', animals.delete);

  // Delete all Animals
  router.delete('/', animals.deleteAll);

  app.use('/api/animals', router);
}