module.exports = (sequelize, Sequelize) => {
  const Shelter = sequelize.define('shelters', {
    cif: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    paranoid: true
  });

  return Shelter;
};
