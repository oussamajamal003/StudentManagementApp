const UserService = require('../../../src/Services/userService');
const User = require('../../../src/Models/User');
const AuditLog = require('../../../src/Models/AuditLog');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../../src/Models/User');
jest.mock('../../../src/Models/AuditLog');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../../src/utils/logger');

describe('User Service', () => {
    
  describe('getAllUsers', () => {
    it('should return all users and log audit', async () => {
      const mockUsers = [{ id: 1, name: 'Alice' }];
      User.findAll.mockResolvedValue(mockUsers);

      const result = await UserService.getAllUsers(99, '127.0.0.1');

      expect(User.findAll).toHaveBeenCalled();
      expect(AuditLog.log).toHaveBeenCalledWith(expect.objectContaining({
        userId: 99,
        action: 'ACCESS_ALL_USERS',
        ipAddress: '127.0.0.1'
      }));
      expect(result).toEqual(mockUsers);
    });
  });

  describe('signup', () => {
    const signupData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      ipAddress: '127.0.0.1'
    };

    it('should create a new user successfully', async () => {
        User.findByEmail.mockResolvedValue(null);
        User.findByUsername.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedPass');
        User.create.mockResolvedValue(101); // Returns new userId
        jwt.sign.mockReturnValue('mockToken');

        // Since random role is used in userService, we can't strict equal check the role in token,
        // but we can check calls.
        
        const result = await UserService.signup(signupData);

        expect(User.findByEmail).toHaveBeenCalledWith(signupData.email);
        expect(bcrypt.hash).toHaveBeenCalledWith(signupData.password, 10);
        expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
            username: signupData.username,
            email: signupData.email,
            password: 'hashedPass',
            createdBy: null
        }));
        expect(User.updateAuditInfo).toHaveBeenCalledWith(101, 101, 101);
        expect(AuditLog.log).toHaveBeenCalledWith(expect.objectContaining({
            action: 'SIGNUP_SUCCESS'
        }));
        expect(result).toHaveProperty('token', 'mockToken');
        expect(result.user).toHaveProperty('user_id', 101);
    });

    it('should throw error if email exists', async () => {
        User.findByEmail.mockResolvedValue({ id: 1 });
        await expect(UserService.signup(signupData)).rejects.toThrow("User already exists");
    });

    it('should throw error if username exists', async () => {
        User.findByEmail.mockResolvedValue(null);
        User.findByUsername.mockResolvedValue({ id: 1 });
        await expect(UserService.signup(signupData)).rejects.toThrow("Username already exists");
    });
  });

  describe('login', () => {
    const loginData = {
        email: 'test@example.com',
        password: 'password123',
        ipAddress: '127.0.0.1'
    };
    const mockUser = {
        user_id: 1,
        username: 'test',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user'
    };

    it('should login successfully with correct credentials', async () => {
        User.findByEmail.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('validToken');

        const result = await UserService.login(loginData);

        expect(AuditLog.log).toHaveBeenCalledWith(expect.objectContaining({
            action: 'LOGIN_SUCCESS',
            userId: 1
        }));
        expect(result).toHaveProperty('token', 'validToken');
    });

    it('should throw error if user not found', async () => {
        User.findByEmail.mockResolvedValue(null);

        await expect(UserService.login(loginData)).rejects.toThrow("Invalid email or password");
        expect(AuditLog.log).toHaveBeenCalledWith(expect.objectContaining({
            action: 'LOGIN_FAILURE',
            details: expect.objectContaining({ reason: 'User not found' })
        }));
    });

    it('should throw error if password incorrect', async () => {
        User.findByEmail.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        await expect(UserService.login(loginData)).rejects.toThrow("Invalid email or password");
        expect(AuditLog.log).toHaveBeenCalledWith(expect.objectContaining({
            action: 'LOGIN_FAILURE',
            details: expect.objectContaining({ reason: 'Incorrect password' })
        }));
    });
  });

  describe('deleteUser', () => {
      it('should delete user and log it', async () => {
          User.delete.mockResolvedValue(true);
          
          await UserService.deleteUser(55, '1.1.1.1');

          expect(User.delete).toHaveBeenCalledWith(55);
          expect(AuditLog.log).toHaveBeenCalledWith(expect.objectContaining({
              action: 'DELETE_ACCOUNT',
              userId: 55
          }));
      });

      it('should throw error if delete fails', async () => {
          User.delete.mockResolvedValue(false);
          await expect(UserService.deleteUser(55, '1.1.1.1')).rejects.toThrow("User not found");
      });
  });
});
