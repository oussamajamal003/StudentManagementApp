const roleGuard = require('../../../src/guards/role.guard');
jest.mock('../../../src/utils/logger');

describe('Role Guard', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: null, originalUrl: '/test' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next() if user has allowed role', () => {
    req.user = { role: 'admin' };
    const guard = roleGuard('admin');
    
    guard(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if user is not authenticated', () => {
    const guard = roleGuard('admin');
    guard(req, res, next); // req.user is null

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized: User not authenticated" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user does not have allowed role', () => {
    req.user = { role: 'user', user_id: 1 };
    const guard = roleGuard('admin');
    
    guard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Forbidden: Insufficient permissions" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow access if multiple roles allowed', () => {
    req.user = { role: 'manager' };
    const guard = roleGuard('admin', 'manager');
    
    guard(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
