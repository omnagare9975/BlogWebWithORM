const { Sequelize } = require('sequelize');

let sequelize;

const initDB = async (config) => {
  sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: 'mysql',
    logging: false,
  });
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

const getSequelize = () => {
  if (!sequelize) throw new Error('Sequelize not initialized');
  return sequelize;
};

module.exports = { initDB, getSequelize };