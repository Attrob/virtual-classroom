const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const Sequelize = require('sequelize');
const sequelize_toddle_config = app_constants.sequelize_toddle_config;

const toddle_app = new Sequelize(sequelize_toddle_config.database, sequelize_toddle_config.username, sequelize_toddle_config.password, sequelize_toddle_config);

const db = {};

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) !== '.js');
    })
    .forEach(file => {
        let dir_path = path.join(__dirname, file);
        if (file === "toddle") {
            fs.readdirSync(dir_path)
                .forEach(file => {
                    let model = toddle_app["import"](path.join(dir_path, file));
                    db[model.name] = model;
                })
        }
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.toddle_app = toddle_app;

module.exports = db;