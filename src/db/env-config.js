const db_key = 'local'; // Default to development, can be overridden by environment variable

const PORT_CONFIG = db_key === "local" ? 3000 : 3001;

export { db_key, PORT_CONFIG };