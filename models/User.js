module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: DataTypes.DATEONLY,
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
      as: "PlantingApproved",
      foreignKey: {
        name: "plantingApprovedBy",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    User.hasMany(models.Planting, {
      as: "PlantingCanceler",
      foreignKey: {
        name: "canceler"
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    User.hasMany(models.Job, {
      as: "Staff",
      foreignKey: {
        name: "staffId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    User.hasMany(models.Job, {
      as: "Assignor",
      foreignKey: {
        name: "assignor",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    User.hasMany(models.Job, {
      as: "Examiner",
      foreignKey: {
        name: "examiner",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    User.hasMany(models.Job, {
      as: "Canceler",
      foreignKey: {
        name: "canceler"
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return User;
};
