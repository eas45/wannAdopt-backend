module.exports = (sequelize, Sequelize) => {
  const Animal_Users = sequelize.define('Animal_Users', {
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: null
    }
  });

  return Animal_Users;
};
