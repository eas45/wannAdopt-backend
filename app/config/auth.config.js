const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  secret: process.env.JWT_SECRET,
  // jwtExpiration: 3600, // 1h
  // jwtRefreshExpiration: 86400  // 24h
  
  /* for test */
  jwtExpiration: 3600,          // 1 min
  // jwtRefreshExpiration: 120,  // 2 minutes
}