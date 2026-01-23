const authGuard = require('../../../src/guards/auth.guard');
const jwt = require('jsonwebtoken');
const env = require('../../../src/config/env');

jest.mock('jsonwebtoken');
jest.mock('../../../src/utils/logger'); // Mock logger to avoid noise

describe('Auth Guard', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      ip: '127.0.0.1'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next() if token is valid', () => {
    req.headers.authorization = 'Bearer validtoken';
    const decodedUser = { user_id: 1, role: 'admin' };
    jwt.verify.mockReturnValue(decodedUser);

    authGuard(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('validtoken', env.JWT_SECRET);
    expect(req.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token provided', () => {
    authGuard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if invalid token format', () => {
    req.headers.authorization = 'InvalidFormat';
    authGuard(req, res, next);
    // Based on code: authHeader.split(" ")[1] will be undefined
    // checks "if (!token)" -> 401
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid token format' });
  });

  it('should return 401 if token is expired', () => {
    req.headers.authorization = 'Bearer expiredtoken';
    const error = new Error('Expired');
    error.name = 'TokenExpiredError';
    jwt.verify.mockImplementation(() => { throw error; });

    authGuard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: Token has expired' });
  });

  it('should return 403 if token is invalid', () => {
    req.headers.authorization = 'Bearer badtoken';
    const error = new Error('Invalid signature');
    jwt.verify.mockImplementation(() => { throw error; });

    authGuard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: Invalid token' });
  });
});
