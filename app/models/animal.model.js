module.exports = (sequelize, Sequelize) => {
  const Animal = sequelize.define('animals', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    breed: {
      type: Sequelize.STRING,
      allowNull: false
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    sex: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    energy: Sequelize.STRING,
    size: Sequelize.STRING,
    hair: Sequelize.STRING
  },
    {
      paranoid: true
    });

  return Animal;
};
