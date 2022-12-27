module.exports = (sequelize, Sequelize) => {
  const Shelter = sequelize.define('shelters', {
    cif: Sequelize.STRING,
    name: Sequelize.STRING,
    city: Sequelize.STRING,
    type: Sequelize.STRING
  },
  {
    paranoid: true
  });

  return Shelter;
};
