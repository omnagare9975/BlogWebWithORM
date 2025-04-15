const { DataTypes } = require('sequelize');
const { getSequelize } = require('../sqldb');

const sequelize = getSequelize();

const Blog = sequelize.define('Blog', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  coverImage: {
    type: DataTypes.STRING,
  },
});

module.exports = Blog;