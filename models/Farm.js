module.exports = (sequelize, DataTypes) => {
  const Farm = sequelize.define(
    "Farm",
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["active", "idle"],
      },
      remark: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );

  Farm.associate = (models) => {
    Farm.belongsTo(models.User, {
      foreignKey: {
        name: "approvedBy",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Farm.hasMany(models.Planting, {
      foreignKey: {
        name: "farmId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Farm;
};
