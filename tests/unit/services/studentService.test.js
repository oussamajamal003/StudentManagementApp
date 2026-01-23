const StudentService = require('../../../src/Services/studentService');
const Student = require('../../../src/Models/Student');

// Mock dependencies
jest.mock('../../../src/Models/Student');
jest.mock('../../../src/utils/logger');

describe('Student Service', () => {

    describe('getAllStudents', () => {
        it('should return all students', async () => {
            const mockStudents = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
            Student.findAll.mockResolvedValue(mockStudents);

            const result = await StudentService.getAllStudents();
            expect(result).toEqual(mockStudents);
        });
    });

    describe('getStudentById', () => {
        it('should return student if found', async () => {
            const mockStudent = { id: 1, name: 'John' };
            Student.findById.mockResolvedValue(mockStudent);

            const result = await StudentService.getStudentById(1);
            expect(result).toEqual(mockStudent);
        });

        it('should throw error if not found', async () => {
            Student.findById.mockResolvedValue(null);
            await expect(StudentService.getStudentById(99)).rejects.toThrow("Student not found");
        });
    });

    describe('createStudent', () => {
        const studentData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            age: 20,
            createdBy: 1
        };

        it('should create student successfully', async () => {
            Student.findByEmail.mockResolvedValue(null); // No email conflict
            Student.create.mockResolvedValue(10); // New ID

            const result = await StudentService.createStudent(studentData);

            expect(Student.findByEmail).toHaveBeenCalledWith(studentData.email);
            expect(Student.create).toHaveBeenCalledWith(studentData);
            expect(result).toHaveProperty('id', 10);
            expect(result.firstName).toBe(studentData.firstName);
        });

        it('should throw error if email exists', async () => {
            Student.findByEmail.mockResolvedValue({ id: 5 }); // Exists
            await expect(StudentService.createStudent(studentData)).rejects.toThrow("Student with this email already exists");
        });
    });

    describe('updateStudent', () => {
        const updateData = {
            firstName: 'Johnny',
            lastName: 'Doe',
            email: 'johnny@example.com',
            age: 21,
            modifiedBy: 1
        };

        it('should update student successfully', async () => {
            const existingStudent = { id: 10, email: 'old@example.com' };
            Student.findById.mockResolvedValue(existingStudent);
            Student.findByEmail.mockResolvedValue(null); // New email not taken
            Student.update.mockResolvedValue(true);

            const result = await StudentService.updateStudent(10, updateData);

            expect(Student.update).toHaveBeenCalledWith(10, updateData);
            expect(result.firstName).toBe(updateData.firstName);
        });

        it('should throw error if student not found', async () => {
            Student.findById.mockResolvedValue(null);
            await expect(StudentService.updateStudent(99, updateData)).rejects.toThrow("Student not found");
        });

        it('should throw error if new email is taken by another', async () => {
            const existingStudent = { id: 10, email: 'john@example.com' };
            Student.findById.mockResolvedValue(existingStudent);
            // Updating email to 'johnny@example.com' which IS taken
            Student.findByEmail.mockResolvedValue({ id: 11, email: 'johnny@example.com' });

            await expect(StudentService.updateStudent(10, updateData)).rejects.toThrow("Student with this email already exists");
        });
        
        it('should allow update if email is same', async () => {
             const existingStudent = { id: 10, email: 'john@example.com' };
             Student.findById.mockResolvedValue(existingStudent);
             
             // Same email
             const sameEmailUpdate = { ...updateData, email: 'john@example.com' };
             
             await StudentService.updateStudent(10, sameEmailUpdate);
             
             expect(Student.findByEmail).not.toHaveBeenCalled(); // Should skip check
             expect(Student.update).toHaveBeenCalled();
        });
    });
});
