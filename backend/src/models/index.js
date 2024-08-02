'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize } from 'sequelize';
import configJson from '../../config/config.json' assert { type: 'json' }; // Adjust the path as necessary

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configJson[env];
const db = {};

console.log('Config:', config); // Debugging line

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

console.log('Sequelize initialized'); // Debugging line

const loadModels = async () => {
  const files = fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    });

  for (const file of files) {
    console.log('Loading model file:', file); // Debugging line
    const modelPath = pathToFileURL(path.join(__dirname, file)).href;
    const model = (await import(modelPath)).default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }

  console.log('Models loaded:', Object.keys(db)); // Debugging line

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

await loadModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db };
export const Profile = db.Profile;
