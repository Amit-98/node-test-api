import mysql from 'mysql2';
import mongoose from 'mongoose';
import { db_key, db_type } from './env-config.js';

// MySQL Configuration from .env
const mysql_config = {
  local: {
    host: process.env.MYSQL_LOCAL_HOST || 'localhost',
    user: process.env.MYSQL_LOCAL_USER || 'root',
    password: process.env.MYSQL_LOCAL_PASSWORD || '',
    database: process.env.MYSQL_LOCAL_DATABASE || 'test',
    port: Number(process.env.MYSQL_LOCAL_PORT) || 3306,
    connectionLimit: 60000,
    queueLimit: 50,
  },
  development: {
    host: process.env.MYSQL_DEV_HOST || 'localhost',
    user: process.env.MYSQL_DEV_USER || 'root',
    password: process.env.MYSQL_DEV_PASSWORD || '',
    database: process.env.MYSQL_DEV_DATABASE || 'test',
    port: Number(process.env.MYSQL_DEV_PORT) || 3306,
    connectionLimit: 5000,
  },
  production: {
    host: process.env.MYSQL_PROD_HOST || '',
    user: process.env.MYSQL_PROD_USER || 'root',
    password: process.env.MYSQL_PROD_PASSWORD || '',
    database: process.env.MYSQL_PROD_DATABASE || '',
    port: Number(process.env.MYSQL_PROD_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 1000,
    queueLimit: 0,
  },
};

// MongoDB Configuration from .env
const mongodb_config = {
  local: {
    uri: process.env.MONGODB_LOCAL_URI || '',
    dbname: process.env.MONGODB_LOCAL_DBNAME || 'blog',
    options: {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },
  development: {
    uri: process.env.MONGODB_DEV_URI || '',
    dbname: process.env.MONGODB_DEV_DBNAME || 'blog',
    options: {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },
  production: {
    uri: process.env.MONGODB_PROD_URI || '',
    dbname: process.env.MONGODB_PROD_DBNAME || 'blog',
    options: {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 60000,
    },
  },
};

let pool = null;

if (db_type === 'mysql') {
  const config = mysql_config[db_key] || mysql_config.local;
  pool = mysql.createPool(config);
  console.log(`✅ MySQL connected successfully [Env: ${db_key}]`);
} else if (db_type === 'mongodb') {
  const config = mongodb_config[db_key] || mongodb_config.local;
  try {
    await mongoose.connect(config.uri, config.options);
    pool = mongoose.connection.useDb(config.dbname);
    console.log(`✅ MongoDB connected successfully [Env: ${db_key}]`);
  } catch (error) {
    console.error(`❌ MongoDB connection error:`, error.message);
  }
}

export { pool };