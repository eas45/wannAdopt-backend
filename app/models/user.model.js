module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    firstSurname: Sequelize.STRING,
    secondSurname: Sequelize.STRING,
    dateOfBirth: {
      type: Sequelize.DATEONLY,
      allowNull: false
    }
  },
  {
    paranoid: true
  });

  return User;
};
