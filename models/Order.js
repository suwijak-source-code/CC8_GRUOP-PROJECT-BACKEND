module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      invNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["waiting for payment", "completed", "cancelled"],
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
    },
    { underscored: true }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.Customer, {
      foreignKey: {
        name: "customerId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: {
        name: "orderId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Order;
};
