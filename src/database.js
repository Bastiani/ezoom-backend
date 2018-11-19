/* eslint-disable no-console */
// @flow
import Sequelize from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const config = require('./databaseConfig.json')[env];

export function createSequelize() {
  return new Sequelize(config.database, config.username, config.password, {
    operatorsAliases: {
      $in: Sequelize.Op.in,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    ...config,
  });
}
