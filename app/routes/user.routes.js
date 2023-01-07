const { authJwt } = require('../middleware');

module.exports = app => {
  const users = require('../controllers/user.controller');

  var router = require('express').Router();

  // Create a new User
  router.post('/', users.create);

  // Retrieve all Users
  router.get('/', users.findAll);

  // Retrieve a single User with id
  router.get('/:id', [authJwt.verifyToken, authJwt.isUser], users.findOne);

  // Update a User with id
  router.put('/:id', [authJwt.verifyToken, authJwt.isUser], users.update);

  // Delete a User with id
  router.delete('/:id', [authJwt.verifyToken, authJwt.isUser], users.delete);

  // // Delete all Users
  // router.delete('/', users.deleteAll);

  router.post('/animals/:id', [authJwt.verifyToken, authJwt.isUser], users.linkWithAnimal);

  app.use('/api/users', router);
}
