module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 1,
        min: 0,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        min: 0,
      },
    },
    { underscored: true }
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: {
        name: "orderId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    OrderItem.hasOne(models.ProductMovement, {
      foreignKey: {
        name: "orderItem",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return OrderItem;
};
