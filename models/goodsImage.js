module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'goodsImage',
    {
      imagePath: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      goodsId: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
    },
    {
      paranoid: true,
    },
  );
