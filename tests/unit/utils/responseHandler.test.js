const { sendResponse, sendError, AppError } = require('../../../src/utils/responseHandler');

describe('Response Handler Utils', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('sendResponse', () => {
    it('should send formatted success response', () => {
      const data = { id: 1 };
      sendResponse(res, 200, data, 'Success msg');

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Success msg',
        data
      });
    });
  });

  describe('sendError', () => {
    it('should send formatted error response', () => {
      sendError(res, 404, 'Not Found');

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        error: 'Not Found'
      });
    });
  });

  describe('AppError Class', () => {
    it('should create error with status code and status string', () => {
      const error = new AppError('Something bad', 400);
      
      expect(error.message).toBe('Something bad');
      expect(error.statusCode).toBe(400);
      expect(error.status).toBe('fail'); // 4xx -> fail
      expect(error.isOperational).toBe(true);
    });

    it('should set status to error for 500', () => {
        const error = new AppError('Server boom', 500);
        expect(error.status).toBe('error'); // 5xx -> error
    });
  });
});
