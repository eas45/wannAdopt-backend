module.exports = app => {
  const auth = require('../controllers/auth.controller');

  var router = require('express').Router();

  // Register
  router.post('/register', auth.register);

  // Login
  // router.post('/login', auth.login);

  app.use('/api/auth', router);
}