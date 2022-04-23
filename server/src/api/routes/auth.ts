import { IUserInputDTO } from "@/interfaces/IUser"
import UserService from "@/service/user"
import { NextFunction, Request, Response, Router } from "express"
import { celebrate, Joi } from 'celebrate';
import Logger from "@/loaders/logger";
import { IError } from "@/interfaces/IError";

const route = Router()

export default (app: Router) => {
    app.use('/auth', route)

    route.post('/register',
     async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userServiceInstance = new UserService()
            Logger.debug('Calling Sign-Up endpoint with body: %o', req.body );
            const { user, token } = await userServiceInstance.createUser(req.body as IUserInputDTO)
            return res.status(200).json({
                user,
                token
            })
        } catch (e) {
            Logger.error('🔥 error: %o', (e as IError).message);
            return next(e);
        }
    })
}   