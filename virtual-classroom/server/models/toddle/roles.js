module.exports = function (toddle_app, DataTypes) {
  const roles = toddle_app.define(
    "roles",
    {
      role_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      role_description: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        unique: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      tableName: "roles",
      timestamps: true,
      underscored: true,
    }
  );

  return roles;
};


