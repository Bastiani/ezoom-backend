// @flow
import Sequelize from 'sequelize';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

export default connection => {
  const User = connection.define(
    'User',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
    },
    {
      tableName: 'users',
      hooks: {
        beforeCreate: (user, options): void => {
          const salt = genSaltSync();
          user.password = hashSync(user.password, salt);
        },
        beforeUpdate: (user, options): void => {
          if (user.changed('password')) {
            const salt = genSaltSync();
            user.password = hashSync(user.password, salt);
          }
        },
      },
    },
  );

  User.prototype.isPassword = (encodedPassword, password) => compareSync(password, encodedPassword);

  return User;
};
