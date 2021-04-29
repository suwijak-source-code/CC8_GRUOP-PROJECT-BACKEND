module.exports = (sequelize, DataTypes) => {
  const CustomerAddress = sequelize.define(
    "CustomerAddress",
    {
      main: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    { underscored: true }
  );

  CustomerAddress.associate = (models) => {
    CustomerAddress.belongsTo(models.Customer, {
      foreignKey: {
        name: "customerId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return CustomerAddress;
};
