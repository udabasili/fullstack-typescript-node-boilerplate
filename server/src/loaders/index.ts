import { Application } from 'express';
import expressLoader   from './express';
import Logger from './logger';
import mongooseLoader  from './mongoose';
//We have to import at least all the events once so they can be triggered

export default async ({ expressApp }: {
    expressApp: Application
}) => {
  await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  await expressLoader ({app: expressApp})
  Logger.info('✌️ Express loaded');



};