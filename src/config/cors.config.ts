import { CorsOptions } from '../@types';
import config from './app.config';

const allowedOrigins =
  config.NODE_ENV === 'development'
    ? 'http://localhost:5173' // Development front-end origin and dashboard
    : ['https://job-supply.netlify.app']; // Production front-end origin

const corsOptions: CorsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true, // Allow cookies and credentials
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (allowedOrigins.includes(origin!) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

export default corsOptions;
