import jwt from 'jsonwebtoken';
import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '@/interfaces/IUser';
import Logger from '@/loaders/logger';
import models from '@/models';
import { IError } from '@/interfaces/IError';

class UserService {

    public async createUser(userInputDTO: IUserInputDTO) {
        try {

            const salt = randomBytes(32);
            Logger.silly('Hashing password');
            const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
            Logger.silly('Creating user db record');
            const userRecord = await models.userModel.create({
                ...userInputDTO,
                salt: salt.toString('hex'),
                password: hashedPassword,
            });
            Logger.silly('Generating JWT');
            const token = this.generateToken(userRecord);
            const user = userRecord.toObject()
            Reflect.deleteProperty(user, 'salt')
            Reflect.deleteProperty(user, 'password')
            return {
                user,
                token
            }

          
        } catch (e) {
            Logger.error((e as IError).message);
            throw e;
        }

    }

    private generateToken(user: IUser) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);
    
        /**
         * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
         * The cool thing is that you can add custom properties a.k.a metadata
         * Here we are adding the userId, role and name
         * Beware that the metadata is public and can be decoded without _the secret_
         * but the client cannot craft a JWT to fake a userId
         * because it doesn't have _the secret_ to sign it
         * more information here: https://softwareontheroad.com/you-dont-need-passport
         */
        Logger.silly(`Sign JWT for userId: ${user._id}`);
        return jwt.sign(
          {
            _id: user._id, // We are gonna use this in the middleware 'isAuth'
            username: user.username,
            exp: exp.getTime() / 1000,
          },
          config.jwtSecret
        );
      }
}

export default UserService