module.exports = (sequelize, DataTypes) => {
  const Planting = sequelize.define(
    "Planting",
    {
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expectedHarvestDate: DataTypes.DATE,
      status: {
        type: DataTypes.ENUM,
        values: ["started", "harvested"],
      },
      remark: DataTypes.STRING,
      inResponsibilityDate: DataTypes.DATE,
      harvestDate: DataTypes.DATE,
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
    Planting.belongsTo(models.Planting, {
      as: "ResponsibleUser",
      foreignKey: {
        name: "responsibleUser",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Planting.belongsTo(models.Planting, {
      as: "Supervisor",
      foreignKey: {
        name: "supervisor",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Planting.belongsTo(models.Planting, {
      as: "HarvestedBy",
      foreignKey: {
        name: "harvestedBy",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Planting.belongsTo(models.Planting, {
      as: "HarvestApprovedBy",
      foreignKey: {
        name: "harvestApprovedBy",
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
  };

  return Planting;
};
