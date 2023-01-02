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

db.profiles = require('./profile.model')(sequelize, Sequelize);
db.users = require('./user.model')(sequelize, Sequelize);
db.shelters = require('./shelter.model')(sequelize, Sequelize);
db.animals = require('./animal.model')(sequelize, Sequelize);

// One To One (Profile-User)
db.profiles.hasOne(db.users, {
  foreignKey: {
    allowNull: false,
    unique: true
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.users.belongsTo(db.profiles);

// One To One (Profile-Shelter)
db.profiles.hasOne(db.shelters, {
  foreignKey: {
    allowNull: false,
    unique: true
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.shelters.belongsTo(db.profiles);

// One To Many (Shelter-Animal)
db.shelters.hasMany(db.animals, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.animals.belongsTo(db.shelters);

// Many To Many (User-Animal)
db.users.belongsToMany(db.animals, { through: 'animal_users' })
db.animals.belongsToMany(db.users, { through: 'animal_users' });

module.exports = db;
