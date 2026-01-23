const studentController = require('../../../src/controllers/student-controllers');
const StudentService = require('../../../src/Services/studentService');
const StudentLog = require('../../../src/Models/StudentLog');

jest.mock('../../../src/Services/studentService');
jest.mock('../../../src/Models/StudentLog');
jest.mock('../../../src/utils/logger');

describe('Student Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            user: { user_id: 1 },
            ip: '127.0.0.1',
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('getStudents', () => {
        it('should return 200 and list of students', async () => {
            const mockStudents = [{ id: 1 }];
            StudentService.getAllStudents.mockResolvedValue(mockStudents);

            await studentController.getStudents(req, res);

            expect(StudentService.getAllStudents).toHaveBeenCalled();
            expect(StudentLog.logAction).toHaveBeenCalledWith(expect.objectContaining({
                action: 'LIST_STUDENTS'
            }));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ students: mockStudents });
        });

        it('should return 500 on service error', async () => {
            StudentService.getAllStudents.mockRejectedValue(new Error('DB Error'));

            await studentController.getStudents(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch students" });
        });
    });

    describe('getStudentById', () => {
        it('should return 200 and student', async () => {
            req.params.id = 1;
            const mockStudent = { id: 1, name: 'John' };
            StudentService.getStudentById.mockResolvedValue(mockStudent);

            await studentController.getStudentById(req, res);

            expect(StudentService.getStudentById).toHaveBeenCalledWith(1);
            expect(StudentLog.logAction).toHaveBeenCalledWith(expect.objectContaining({
                action: 'VIEW_STUDENT',
                studentId: 1
            }));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockStudent);
        });

        it('should return 404 if student not found', async () => {
            req.params.id = 99;
            StudentService.getStudentById.mockRejectedValue(new Error("Student not found"));

            await studentController.getStudentById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Student not found" });
        });
    });
});
