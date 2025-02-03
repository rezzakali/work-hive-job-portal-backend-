import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import config from './config/app.config';
import corsOptions from './config/cors.config';
import { HTTPSTATUS } from './config/http.config';
import errorHandler from './helpers/errorHandler';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import generalRoutes from './routes/generalRoutes';
import jobRoutes from './routes/jobRoutes';

// base path
const BASE_PATH = config.BASE_PATH;

const app = express();

// morgan config
app.use(morgan('tiny'));

// body-parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow preflight requests for all routes
app.options('*', cors());
// cors-policy
app.use(cors(corsOptions));

// routes
app.use(`${BASE_PATH}/admin`, adminRoutes);
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/jobs`, jobRoutes);
app.use(`${BASE_PATH}/general`, generalRoutes);

// customize error handler
app.use(errorHandler);

// default error
app.use((_err: any, req: Request, res: Response, next: () => void) => {
  if (res.headersSent) {
    return next();
  }
  res
    .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
    .json({ error: 'There was a server side error!' });
});

export default app;
