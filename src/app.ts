import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import config from './config/app.config';
import { HTTPSTATUS } from './config/http.config';
import errorHandler from './helpers/errorHandler';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';

// base path
const BASE_PATH = config.BASE_PATH;

const app = express();

// socket
// const server = http.createServer(app);
// initSocket(server); // Initialize WebSocket

// morgan config
app.use(morgan('tiny'));

// body-parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow preflight requests for all routes
app.options('*', cors());
// cors-policy
// app.use(cors(corsOptions));
app.use(
  cors({
    origin: '*',
    methods: '*',
    credentials: true,
  })
);

// routes
app.use(`${BASE_PATH}/admin`, adminRoutes);
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/jobs`, jobRoutes);
// app.use(`${BASE_PATH}/general`, generalRoutes);
// app.use(`${BASE_PATH}/test`, async (req, res) => {
//   try {
//     // Assuming you have a Notification model and a deleteMany method
//     const result = await Notification.deleteMany({});
//     res
//       .status(200)
//       .json({ message: 'All notifications deleted successfully', result });
//   } catch (error) {
//     console.log('🚀 ~ app.use ~ error:', error);
//     res.status(500).json({ error: 'Failed to delete notifications' });
//   }
// });

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
