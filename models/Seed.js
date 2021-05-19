module.exports = (sequelize, DataTypes) => {
  const Seed = sequelize.define(
    "Seed",
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
      },
      plantingTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      remark: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );

  Seed.associate = (models) => {
    Seed.belongsTo(models.User, {
      foreignKey: {
        name: "approvedBy",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Seed.hasMany(models.Planting, {
      foreignKey: {
        foreignKey: {
          name: "seedId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      },
    });
  };

  return Seed;
};
