const request = require('supertest');
const app = require('../../src/App');
const UserService = require('../../src/Services/userService');
const jwt = require('jsonwebtoken');

jest.mock('../../src/Services/userService');
jest.mock('../../src/Models/AuditLog'); // Mock audit log

describe('Auth Routes Integration', () => {
    
    describe('POST /api/auth/signup', () => {
        it('should return 201 on success', async () => {
            UserService.signup.mockResolvedValue({
                user: { id: 1, email: 'test@test.com', role: 'user' },
                token: 'abc'
            });

            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    username: 'test',
                    email: 'test@test.com',
                    password: 'password'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 400 if fields missing', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'test@test.com' }); // Missing pass/username

            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return 200 on success', async () => {
            UserService.login.mockResolvedValue({
                user: { id: 1, email: 'test@test.com' },
                token: 'xyz'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@test.com', password: 'pass' });

            expect(res.statusCode).toBe(200);
        });

        it('should return 401 on invalid credential error from service', async () => {
             UserService.login.mockRejectedValue(new Error("Invalid email or password"));
             
             const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@test.com', password: 'wrong' });

             expect(res.statusCode).toBe(401);
             expect(res.body).toEqual({ error: "Invalid email or password" });
        });
    });
});
