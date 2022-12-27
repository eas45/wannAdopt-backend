const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.animals = require('./animal.model')(sequelize, Sequelize);
db.profiles = require('./profile.model')(sequelize, Sequelize);
db.users = require('./user.model')(sequelize, Sequelize);
db.shelters = require('./shelter.model')(sequelize, Sequelize);

// One To One (Profile-User)
db.profiles.hasOne(db.users, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.users.belongsTo(db.profiles);

// One To One (Profile-Shelter)
db.profiles.hasOne(db.shelters, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.shelters.belongsTo(db.profiles);

module.exports = db;