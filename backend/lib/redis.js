import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export const redis = new Redis(
  'rediss://default:AWNpAAIjcDFjY2U2OTE0ZDI3YzI0OThmOGExMzA3MWZmNmU0YzQ0Y3AxMA@more-leech-25449.upstash.io:6379'
);