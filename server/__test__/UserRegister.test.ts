import 'jest';
import 'mocha';
import 'jasmine'

import request from 'supertest'
import express, { Application } from 'express';
import models from '../src/models'
import { IUser } from '@/interfaces/IUser';
const app = express();

beforeAll(() => {
    return require('../src/loaders/').default({ expressApp: app });
})


const userData = {
    username: 'user1',
    email: 'user@email.com',
    password: 'Password'
}

const startFunction = (app: Application) => {
    return request(app).post('/api/auth/register')
        .send(userData)
}
describe('User Registration', () => {

    beforeEach(async () => {

        await models.userModel.deleteMany({})
    })

    //we add done to make the test synchronous so expect waits for everythin else to run before checking
    test('return 200 OK when signup request is valid', (done) => {
        startFunction(app).then((response: any) => {
        expect(response.status).toBe(200)
        done()
    })
        //we can do use above(the then block ) or below to check the assertion
        //.expect(200, done)
    });

    test('return two objects in body response when sign up is valid', (done) => {
        startFunction(app)
            .then((response) => {
                expect(Object.keys(response.body).length).toBe(2)
                done()
            })

    });

    test('save username and email to db', (done) => {
        startFunction(app)
            .then(() => {
                //query user table
                models.userModel.find({}).then((userList) => {
                    expect(userList.length).toBe(1)
                    const savedUser = userList[0]
                    expect(savedUser.username).toBe('user1')
                    expect(savedUser.email).toBe('user@email.com')
                    done()

                })
            })

    });

    test('hashes the password to db ', (done) => {
        startFunction(app)
            .then(() => {
                models.userModel.find({}).then((userList) => {
                    expect(userList.length).toBe(1)
                    const savedUser = userList[0]
                    expect(savedUser.password).not.toBe('Password')
                    done()

                })
            })

    });

});