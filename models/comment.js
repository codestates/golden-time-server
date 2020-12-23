module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "comment",
    {
      userId: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      commentMessage: {
        type: DataTypes.STRING(),
        allowNUll: false,
      },
      postId: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );
