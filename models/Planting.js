module.exports = (sequelize, DataTypes) => {
  const Planting = sequelize.define(
    "Planting",
    {
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      plantedAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      harvestedAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["started", "harvested", "finished", "cancel"],
      },
      remark: DataTypes.STRING,
      harvestDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      assignStatus: {
        type: DataTypes.ENUM,
        values: ["assign", "notAssign"],
      },
      fertilizerPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
      },
      maintenanceCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
      },
      miscellaneousExpenses: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
      }
    },
    {
      underscored: true,
    }
  );

  Planting.associate = (models) => {
    Planting.belongsTo(models.Farm, {
      foreignKey: {
        name: "farmId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Planting.belongsTo(models.Seed, {
      foreignKey: {
        name: "seedId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Planting.belongsTo(models.Customer, {
      foreignKey: {
        name: "reservedCustomer",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Planting.belongsTo(models.User, {
      as: "PlantingApproved",
      foreignKey: {
        name: "plantingApprovedBy",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Planting.belongsTo(models.User, {
      as: "PlantingCanceler",
      foreignKey: {
        name: "canceler"
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Planting.hasMany(models.PlantingTransaction, {
      foreignKey: {
        name: "plantingId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Planting.hasMany(models.ProductMovement, {
      foreignKey: {
        name: "plantingId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Planting.hasMany(models.Job, {
      foreignKey: {
        name: "plantingId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Planting;
};
