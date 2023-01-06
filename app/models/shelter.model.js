module.exports = (sequelize, Sequelize) => {
  const Shelter = sequelize.define('shelters', {
    cif: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    }
  },
  {
    paranoid: true
  });

  return Shelter;
};
