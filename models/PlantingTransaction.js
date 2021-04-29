module.exports = (sequelize, DataTypes) => {
  const PlantingTransaction = sequelize.define(
    "PlantingTransaction",
    {
      date: {
        type: DataTypes.DATE(6),
        defaultVale: new Date(),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM,
        values: ["cost", "income"],
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vendorCustomerName: DataTypes.STRING,
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 1,
      },
      unit: DataTypes.STRING,
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        min: 0,
      },
      remark: DataTypes.STRING,
    },
    { underscored: true }
  );

  PlantingTransaction.associate = (models) => {
    PlantingTransaction.belongsTo(models.Planting, {
      foreignKey: {
        name: "plantingId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return PlantingTransaction;
};
