import Sequelize from 'sequelize';

export default connection => {
  const Product = connection.define(
    'Product',
    {
      title: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.INTEGER,
      },
      text: {
        type: Sequelize.STRING,
      },
      // images: {

      // },
      // movies: {

      // },
      // location: {},
    },
    {
      tableName: 'product',
    },
  );

  Product.prototype.associate = models => {
    Product.belongsTo(models.Category, {
      foreignKey: {
        allowNull: false,
        field: 'category',
        name: 'category',
      },
    });
  };

  return Product;
};
