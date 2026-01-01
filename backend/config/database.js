import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

// Create database if it doesn't exist
export const createDatabaseIfNotExists = async () => {
  const tempSequelize = new Sequelize('', process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  });

  try {
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log('Database created or already exists');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await tempSequelize.close();
  }
};

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

