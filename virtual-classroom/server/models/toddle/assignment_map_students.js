module.exports = function (toddle_app, DataTypes) {
  const assignment_map_students = toddle_app.define(
    "assignment_map_students",
    {
      map_id: {
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
      student_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        },
        onUpdate : 'CASCADE',
        onDelete : 'CASCADE'
      },
      status: {
        type: DataTypes.STRING(60),
        allowNull: true,
        defaultValue: app_constants.assignment_status.pending,
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
      tableName: "assignment_map_students",
      timestamps: true,
      underscored: true,
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['assignment_id', 'student_id']
            }
        ]
    }
  );

  return assignment_map_students;
};


