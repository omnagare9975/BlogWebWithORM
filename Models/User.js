const { DataTypes } = require('sequelize');
const { getSequelize } = require('../sqldb'); // make sure this exports the sequelize instance

const sequelize = getSequelize()
const UserModel = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'users', // optional: defines table name
  timestamps: false // optional: adds createdAt and updatedAt
});


sequelize.sync()
  .then(() => {
    console.log("User table created!");
  })
  .catch(err => {
    console.error("Error creating table:", err);
  });
module.exports = { UserModel };
