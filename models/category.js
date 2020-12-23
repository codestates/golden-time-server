module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "category",
    {
      categoryName: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      parentCategoryId: {
        type: DataTypes.INTEGER(),
        allowNull: true,
      },
    },
    {
      paranoid: true,
    }
  );
