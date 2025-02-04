import 'dotenv/config';
import config from '../config/app.config';

const origins =
  config.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://localhost:5173'] // Development front-end origin and dashboard
    : [
        'https://job-portal-dashboard.vercel.app',
        'https://workshive.netlify.app',
      ]; // Production front-end origin dashboard

export default origins;
