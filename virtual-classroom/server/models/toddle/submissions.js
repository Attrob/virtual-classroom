module.exports = function (toddle_app, DataTypes) {
  const submissions = toddle_app.define(
    "submissions",
    {
      submission_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      assignment_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: 'assignments',
            key: 'assignment_id'
        },
        onUpdate : 'CASCADE',
        onDelete : 'CASCADE'
      },
      assignment_data: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      submitted_by: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        },
        onUpdate : 'CASCADE',
        onDelete : 'CASCADE'
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
      tableName: "submissions",
      timestamps: true,
      underscored: true,
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['assignment_id', 'submitted_by', 'is_active']
            }
        ]
    }
  );

  return submissions;
};


