module.exports = function (toddle_app, DataTypes) {
  const assignments = toddle_app.define(
    "assignments",
    {
      assignment_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      assignment_title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      assignment_description: {
        type: DataTypes.STRING(1024),
        allowNull: false,
      },
      tutor_id: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        },
        onUpdate : 'CASCADE',
        onDelete : 'CASCADE'
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      assignment_status: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    },
    {
      tableName: "assignments",
      timestamps: true,
      underscored: true,
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['assignment_title', 'tutor_id']
            }
        ]
    }
  );

  return assignments;
};


