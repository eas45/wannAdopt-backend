const { verifyRegister } = require('../middleware');
const auth = require('../controllers/auth.controller');
var router = require('express').Router();

module.exports = app => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  // Register
  router.post(
    '/register',
    [verifyRegister.checkDuplicateEmail],
    auth.register);

  // Login
  router.post('/login', auth.login);

  // Logout
  router.post('/logout', auth.logout);

  app.use('/api/auth', router);
}

// module.exports = function(app) {
//   app.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   app.post(
//     '/register',
//     [
//       verifyRegister.checkDuplicateEmail
//     ],
//     auth.register
//   );
// }