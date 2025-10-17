// app/models/refreshToken.model.js
export default (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define("refresh_tokens", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: Sequelize.STRING,
    },
    expiryDate: {
      type: Sequelize.DATE,
    },
  });
  return RefreshToken;
};
