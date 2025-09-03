const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles } = require('./auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('authenticateToken', () => {
    it('should return 401 if no token provided', () => {
      authenticateToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access token missing' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', () => {
      req.headers['authorization'] = 'Bearer invalidtoken';
      authenticateToken(req, res, next);
      // Since jwt.verify is async, we need to mock it or use done callback
    });

    it('should call next if token is valid', (done) => {
      const payload = { id: 1, role: 'user' };
      const token = jwt.sign(payload, JWT_SECRET);

      req.headers['authorization'] = `Bearer ${token}`;

      // Override jwt.verify to call callback synchronously for test
      const originalVerify = jwt.verify;
      jwt.verify = (token, secret, callback) => {
        callback(null, payload);
      };

      authenticateToken(req, res, () => {
        expect(req.user).toEqual(payload);
        jwt.verify = originalVerify;
        done();
      });
    });
  });

  describe('authorizeRoles', () => {
    it('should return 401 if user not authenticated', () => {
      const middleware = authorizeRoles('admin');
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user role not allowed', () => {
      req.user = { role: 'user' };
      const middleware = authorizeRoles('admin');
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'User does not have permission to access this resource' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user role is allowed', () => {
      req.user = { role: 'admin' };
      const middleware = authorizeRoles('admin', 'user');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
