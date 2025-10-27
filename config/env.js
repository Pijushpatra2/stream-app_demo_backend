// config/env.js
// import dotenv from 'dotenv';

// dotenv.config(); // Load .env file

// export const ENV = {
//     PORT: process.env.PORT || 5000,
//     NODE_ENV: process.env.NODE_ENV || 'development',

//     DB_HOST: process.env.DB_HOST || '127.0.0.1',
//     DB_PORT: process.env.DB_PORT || 3306,
//     DB_NAME: process.env.DB_NAME || 'multi_tenant_db',
//     DB_USER: process.env.DB_USER || 'root',
//     DB_PASS: process.env.DB_PASS || '',

//     JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
//     JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
// };



import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env file
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.warn('.env file not found, using default environment variables');
}

export const ENV = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,

    DB_HOST: process.env.DB_HOST,
    DB_READ_HOST: process.env.DB_READ_HOST || process.env.DB_HOST,
    DB_PORT: parseInt(process.env.DB_PORT, 10),
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10),
};
