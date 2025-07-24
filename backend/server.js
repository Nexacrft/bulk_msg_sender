// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Database connection
// let dbConnected = false;

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//     dbConnected = true;
//   } catch (error) {
//     console.error('Database connection failed:', error.message);
//     dbConnected = false;
//   }
// };

// // Connect to database
// connectDB();

// // Routes
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     message: 'Server is running',
//     database: dbConnected,
//     timestamp: new Date().toISOString()
//   });
// });

// app.get('/api', (req, res) => {
//   res.json({
//     message: 'Bulk Mail Sender API',
//     version: '1.0.0',
//     endpoints: [
//       'GET /api/health - Health check'
//     ]
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : {}
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     message: 'Route not found'
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
//   console.log(`Environment: ${process.env.NODE_ENV}`);
// });


import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/auth.js';
import './config/passport.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
