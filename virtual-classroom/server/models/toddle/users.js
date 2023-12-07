module.exports = function (toddle_app, DataTypes) {
  const users = toddle_app.define(
    "users",
    {
      user_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(1024),
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: 'roles',
            key: 'role_id'
        },
        onUpdate : 'CASCADE',
        onDelete : 'CASCADE'
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
      tableName: "users",
      timestamps: true,
      underscored: true,
    }
  );

  return users;
};


