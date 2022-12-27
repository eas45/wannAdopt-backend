module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    name: Sequelize.STRING,
    firstSurname: Sequelize.STRING,
    secondSurname: Sequelize.STRING,
    dateOfBirth: Sequelize.DATEONLY
  },
  {
    paranoid: true
  });

  return User;
};
