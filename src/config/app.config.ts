import getEnv from '../utils/get-env';

const appConfig = () => ({
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  APP_ORIGIN: getEnv('APP_ORIGIN', 'localhost'),
  PORT: getEnv('PORT', '5000'),
  BASE_PATH: getEnv('BASE_PATH', '/api/v1'),
  MONGO_URI: getEnv('MONGO_URI'),
  MONGO_URI_ATLAS: getEnv('MONGO_URI_ATLAS'),
  JWT: {
    SECRET: getEnv('JWT_SECRET'),
    EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '30 days'),
  },
  SALT_ROUND: getEnv('SALT_ROUND', '10'),
  IMAGEKIT_PUBLIC_KEY: getEnv('IMAGEKIT_PUBLIC_KEY', ''),
  IMAGEKIT_PRIVATE_KEY: getEnv('IMAGEKIT_PRIVATE_KEY', ''),
  IMAGEKIT_URL_ENDPOINT: getEnv('IMAGEKIT_URL_ENDPOINT', ''),
  MAILER_SENDER: getEnv('MAILER_SENDER'),
  MAILER_SENDER_PASSWORD: getEnv('MY_PASSWORD'),
});

const config = appConfig();

export default config;
