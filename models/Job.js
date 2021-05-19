module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define(
    "Job",
    {
      mission: {
        type: DataTypes.ENUM,
        values: ["gardening", "harvest"],
      },
      status: {
        type: DataTypes.ENUM,
        values: ["assign", "in progress", "checking", "finish", "cancel"],
      },
      assignDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );

  Job.associate = (models) => {
    Job.belongsTo(models.User, {
      as: "Staff",
      foreignKey: {
        name: "staffId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Job.belongsTo(models.User, {
      as: "Assignor",
      foreignKey: {
        name: "assignor",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Job.belongsTo(models.User, {
      as: "Examiner",
      foreignKey: {
        name: "examiner",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Job.belongsTo(models.User, {
      as: "Canceler",
      foreignKey: {
        name: "canceler",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Job.belongsTo(models.Planting, {
      foreignKey: {
        name: "plantingId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Job;
};
