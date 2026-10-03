import dotenv from 'dotenv';
dotenv.config();

const db_key = process.env.DB_KEY || 'local'; // 'local', 'development', 'production'
const db_type = process.env.DB_TYPE || 'mysql'; // 'mysql', 'mongodb'
const PORT_CONFIG = process.env.PORT ? Number(process.env.PORT) : (db_key === 'local' ? 3000 : 3001);

export { db_key, PORT_CONFIG, db_type };