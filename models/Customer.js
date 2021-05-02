modele.exports = (sequlize, DataTypes) => {
  const Customer = sequelize.define("Customer", {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vatId: {
      type: DataTypes.STRING,
    },
  });
  Customer.associate = (models) => {
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
