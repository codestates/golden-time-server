module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'goods',
    {
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      bidPrice: {
        type: DataTypes.INTEGER(),
        allowNull: true,
      },
      closing_time: {
        type: DataTypes.DATE(),
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    },
  );
