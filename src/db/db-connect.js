import mysql from 'mysql2';
import mongoose, { mongo } from 'mongoose';
import {db_key, db_type} from './env-config.js';

const mysql_config = {
    local: {
    user: "root",
    host: "localhost",
    password: "Amit@0145",
    database: "test",
    port:3306,
    connectionLimit: 60000,
    queueLimit:50
  },
  devlopment: {
    user: "root",
    host: "localhost",
    password: "Amit@0145",
    database: "test",
    port:3306,
    connectionLimit: 5000,
  },
  production: {
    user: "root",
    host: "",
    password: "",
    database: "",
    port:3306,
    waitForConnections:true,
    connectionLimit: 1000,
    queueLimit:0
  },
}

// MongoDB Configuration
const mongodb_config = {
  local: {
    dbname: "blog",
    uri: `mongodb+srv://Amit:Amit0145@cluster0.yrgvw8j.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0`,
    options: {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  development: {
    uri: "mongodb+srv://Amit:Amit0145@cluster0.yrgvw8j.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0",
    options: {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
    dbname: "blog"
  },
  production: {
    uri: "mongodb+srv://Amit:Amit0145@cluster0.yrgvw8j.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0",
    options: {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 60000,
    },
    dbname: "blog"
  }
}

let pool = null;
let mongoConnection = null;

if(db_type === 'mysql') 
{
  pool = mysql.createPool(mysql_config[db_key] || mysql_config.local);
  console.log("MYSQL connected successfully");
}
else if(db_type === 'mongodb')
{
  const config = mongodb_config[db_key] || mongodb_config.local;
  await mongoose.connect(config.uri, config.options);

  pool = mongoose.connection.useDb(config.dbname);
  console.log("MongoDB connected successfully");
}

export {pool};