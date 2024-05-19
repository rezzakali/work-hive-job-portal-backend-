import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import dbConnection from '../src/config/dbConnection';
import errorHandler from './helpers/errorHandler';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';

// environment config
dotenv.config();

// PORT & HOST_NAME
const PORT: number = Number(process.env.PORT) || 5000;

const HOST_NAME: string = process.env.HOST_NAME || 'localhost';

// db config
dbConnection();

const app = express();

// morgan config
app.use(morgan('dev'));

// body-parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const accessOrigin =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : 'https://job-portal-dashboard.vercel.app';
// cors-policy
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    origin: accessOrigin,
    // origin: '*',
  })
);

// routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);

// customize error handler
app.use(errorHandler);

// default error
app.use((_err: any, req: Request, res: Response, next: () => void) => {
  if (res.headersSent) {
    return next();
  }
  res.status(500).json({ error: 'There was a server side error!' });
});

// listening the server
app.listen(PORT, HOST_NAME, () => {
  console.log(
    `Your server is running successfully on http://${HOST_NAME}:${PORT}`
  );
});
