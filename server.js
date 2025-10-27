// // server.js
// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import sequelize from './config/db.js';
// import morgan from 'morgan';

// import S_A_Router from "./routes/superAdminRoutes.js";
// import videoRoutes from './routes/video/videoRoutes.js';


// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// //Configure CORS properly
// const corsOptions = {
//   origin: [
//     process.env.CLIENT_URL,
//   ],
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

// app.use(cors(corsOptions));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));

// //Test DB connection
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connected successfully from server side');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error.message);
//     process.exit(1);
//   }
// })();

// //Test route
// app.get('/', (req, res) => {
//   res.send('Server is running with MySQL connection!');
// });

// app.use('/api/v1/superAdmin', (S_A_Router))
// // Routes
// app.use('/api/v1/videos', videoRoutes);


// //Start Server
// app.listen(PORT, () => {
//   console.log(`Server listening at http://localhost:${PORT}`);
// });


// server.js
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';             // ✅ add this
import sequelize from './config/db.js';

import S_A_Router from "./routes/superAdminRoutes.js";
import videoRoutes from "./routes/video/videoRoutes.js";

dotenv.config();

const app = express();
// const PORT = process.env.PORT || 10000;

// ✅ Enable CORS globally
app.use(cors({ origin: "*" }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Test DB connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully from server side');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
})();

// Test route
app.get('/', (req, res) => {
  res.send('Server is running with MySQL connection!');
});

// Routes
app.use('/api/v1/superAdmin', S_A_Router);
app.use('/api/v1/videos', videoRoutes);

// Start Server
const PORT = process.env.PORT || 5005;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
