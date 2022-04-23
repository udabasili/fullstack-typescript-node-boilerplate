import express, { Application, NextFunction, Request, Response } from "express"
import cors from 'cors';
import routes from '@/api';
import config from "@/config";
import { IError } from "@/interfaces/IError";
import { isCelebrateError } from "celebrate";

class CustomError extends Error {
    message: string;

    constructor(message: string, public status: number) {
        super(message);
        this.message = message
        this.status = status
    }
}

export default ({ app }: { app: Application }) => {
    /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');

    // The magic package that prevents frontend developers going nuts
    // Alternate description:
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors());

    // Transforms the raw string of req.body into json
    app.use(express.json());

    app.use('/api', routes())

    app.use((req: Request, res: Response, next: NextFunction) => {
        const errorCustom = new CustomError('Not Found', 404)
        next(errorCustom)
    })

    app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
        /**
    * Handle 401 thrown by express-jwt library
    */
        if (error.name === "UnauthorizedError") {
            return res.status(401).json({
                message: 'UnAuthorized'
            })            
        }

            if (isCelebrateError(error)) {
        
              const errorBody = error.details.get('body')?.message; // 'details' is a Map()
              error.message = errorBody || ''
            }
            res.status(error.status || 500);
            console.log(error.message)
            return res.json({
              message: error.message,
        
            })
          })


}