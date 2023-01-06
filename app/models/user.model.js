module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
    firstSurname: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    secondSurname: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    dateOfBirth: Sequelize.DATEONLY
  },
    {
      paranoid: true
    });

  return User;
};
