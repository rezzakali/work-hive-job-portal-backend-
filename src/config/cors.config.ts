import { CorsOptions } from '../@types';

const allowedOrigins =
  process.env.NODE_ENV === 'development'
    ? ['http://localhost:5173', 'http://localhost:3000'] // Development front-end origin and dashboard
    : ['https://job-portal-dashboard.vercel.app']; // Production front-end origin

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
