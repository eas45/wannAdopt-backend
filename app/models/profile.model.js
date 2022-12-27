module.exports = (sequelize, Sequelize) => {
  const Profile = sequelize.define("profile", {
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    salt: {
      type: Sequelize.STRING,
      defaulValue: "none"
    }
  }/* ,
  {
    paranoid: true
  } */);

  return Profile;
};
