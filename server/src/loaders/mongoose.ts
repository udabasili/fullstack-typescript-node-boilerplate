import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '@/config';

let dbUrl = ''

if (process.env.NODE_ENV === "test") {
  dbUrl = config.databaseURLTest
} else {
  dbUrl = config.databaseURL
}
export default async (): Promise<Db> => {
  const connection = await mongoose.connect(dbUrl);
  return connection.connection.db;
};