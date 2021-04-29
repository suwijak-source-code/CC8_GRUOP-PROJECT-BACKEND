module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      VatId: {
        type: DataTypes.STRING,
        field: "VAT_id",
      },
    },
    { underscored: true }
  );

  Customer.associate = (models) => {
    Customer.hasMany(models.Order, {
      foreignKey: {
        name: "customerId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Customer.hasMany(models.CustomerAddress, {
      foreignKey: {
        name: "customerId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Customer;
};
