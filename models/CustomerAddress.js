module.exports = (sequelize, Datatypes) => {
  const CustomerAddress = sequelize.define(
    "CustomerAddress",
    {
      main: {
        type: Datatypes.ENUM,
      },
      address: {
        type: Datatypes.STRING,
        allowNull: false,
      },
      phone: {
        type: Datatypes.STRING,
      },
      email: {
        type: Datatypes.STRING,
      },
    },
    {
      timestamps: false,
      underscored: true,
    }
  );
  CustomerAddress.associate = (models) => {
    CustomerAddress.belongsto(models.Customer, {
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
