import mysql from 'mysql2';
import {db_key} from './env-config.js';

const db_config = {
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

const pool = mysql.createPool(db_config[db_key] || db_config.local);

export {pool};