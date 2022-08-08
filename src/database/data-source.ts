import 'dotenv/config';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // host: process.env.POSTGRES_HOST,
  // port: parseInt(process.env.POSTGRES_PORT, 10),
  // username: process.env.POSTGRES_USER,
  // password: process.env.POSTGRES_PASSWORD,
  // database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: true,
  entities: ['src/**/*.entity.ts'],
  migrationsTableName: 'migrations',
  migrations: ['src/database/migrations/*.ts'],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

export { dataSource };
