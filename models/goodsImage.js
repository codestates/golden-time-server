module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "goodsImage",
    {
      imagePath: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );
