import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    postgres: {
      database: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      password: process.env.POSTGRES_PASSWORD,
      username: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      url: process.env.DATABASE_URL,
    },
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
  };
});
