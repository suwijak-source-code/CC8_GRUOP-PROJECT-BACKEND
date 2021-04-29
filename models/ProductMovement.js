module.exports = (sequelize, DataTypes) => {
  const ProductMovement = sequelize.define(
    "ProductMovement",
    {
      type: {
        type: DataTypes.ENUM,
        values: ["add", "sales", "others"],
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 1,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        min: 0,
      },
      // averageCost: {
      //   type: DataTypes.DECIMAL(10, 2),
      //   defaultValue: 0,
      //   min: 0,
      // },
    },
    { underscored: true }
  );

  ProductMovement.associate = (models) => {
    ProductMovement.belongsTo(models.Product, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    ProductMovement.belongsTo(models.Planting, {
      foreignKey: {
        name: "plantingId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    ProductMovement.belongsTo(models.OrderItem, {
      foreignKey: {
        name: "orderItem",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return ProductMovement;
};
