// @flow
import Sequelize from 'sequelize';

export default connection => {
  const Category = connection.define(
    'Category',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: 'category',
    },
  );

  return Category;
};
