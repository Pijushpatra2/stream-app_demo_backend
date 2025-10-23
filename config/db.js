// // config/db.js
// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST || '127.0.0.1',
//     port: process.env.DB_PORT || 3306,
//     dialect: 'mysql',
//     logging: process.env.NODE_ENV === 'development' ? console.log : false,
//     pool: {
//       max: 10,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//     define: {
//       freezeTableName: true,
//       timestamps: true, // createdAt, updatedAt
//     },
//   }
// );

// export default sequelize;




//For Testing

// config/db.js
import { Sequelize } from 'sequelize';
import { ENV } from './env.js';
import { logger } from '../utils/logger.js';

const isDev = ENV.NODE_ENV === 'development';

// Sequelize instance with optimized connection pool and replication
const sequelize = new Sequelize(
    ENV.DB_NAME,
    ENV.DB_USER,
    ENV.DB_PASS,
    {
        dialect: 'mysql',

        replication: {
            read: [
                {
                    host: ENV.DB_READ_HOST,
                    username: ENV.DB_USER,
                    password: ENV.DB_PASS,
                },
                // add more read replicas here if needed
            ],
            write: {
                host: ENV.DB_HOST,
                username: ENV.DB_USER,
                password: ENV.DB_PASS,
            },
        },

        port: ENV.DB_PORT,

        pool: {
            max: 50,
            min: 10,
            acquire: 60000,
            idle: 10000,
            evict: 1000,
        },

        define: {
            freezeTableName: true, // do not pluralize table names
            timestamps: true,
        },

        logging: isDev ? (msg) => logger.info(msg) : false,

        dialectOptions: {
            connectTimeout: 10000, // 10s
        },
    }
);

// Test connection
(async () => {
    try {
        await sequelize.authenticate();
        logger.info('Database connected successfully');
    } catch (err) {
        logger.error(`Database connection failed: ${err.message}`);
        process.exit(1); // stop app if DB fails
    }
})();

export default sequelize;
