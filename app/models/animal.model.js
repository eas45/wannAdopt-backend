module.exports = (sequelize, Sequelize) => {
  const Animal = sequelize.define('animals', {
    name: Sequelize.STRING,
    breed: Sequelize.STRING,
    age: Sequelize.INTEGER,
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
