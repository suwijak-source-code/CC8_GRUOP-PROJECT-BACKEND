module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values: ["admin", "sales", "gardener"],
      },
      status: {
        type: DataTypes.ENUM,
        values: ["active", "break", "quited"],
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["male", "female"],
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      nationalId: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      approvedBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imgPath: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Farm, {
      foreignKey: {
        name: "approvedBy",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    User.hasMany(models.Seed, {
      foreignKey: {
        name: "approvedBy",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    User.hasMany(models.Planting, {
      as: "ResponsibleUser",
      foreignKey: {
        name: "responsibleUser",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    User.hasMany(models.Planting, {
      as: "Supervisor",
      foreignKey: {
        name: "supervisor",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    User.hasMany(models.Planting, {
      as: "HarvestedBy",
      foreignKey: {
        name: "harvestedBy",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    User.hasMany(models.Planting, {
      as: "HarvestApprovedBy",
      foreignKey: {
        name: "harvestApprovedBy",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return User;
};
