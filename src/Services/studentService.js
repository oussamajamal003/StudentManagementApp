const Student = require("../Models/Student");
const logger = require("../utils/logger");

class StudentService {
  static async getAllStudents() {
    // Return all students as an array (no pagination/search)
    const students = await Student.findAll();
    return students;
  }

  static async getStudentById(id) {
    const student = await Student.findById(id);
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  }

  static async createStudent({ firstName, lastName, email, age, createdBy }) {
    // Check if email already exists
    const existingStudent = await Student.findByEmail(email);
    if (existingStudent) {
      throw new Error("Student with this email already exists");
    }

    const studentId = await Student.create({ firstName, lastName, email, age, createdBy });
    logger.info(`Student created: ${email} by Admin ID: ${createdBy}`);
    
    return { id: studentId, firstName, lastName, email };
  }

  static async updateStudent(id, { firstName, lastName, email, age, modifiedBy }) {
    const student = await Student.findById(id);
    if (!student) {
      throw new Error("Student not found");
    }

    // Check if email is taken by another student
    if (email !== student.email) {
      const existingStudent = await Student.findByEmail(email);
      if (existingStudent) {
        throw new Error("Student with this email already exists");
      }
    }

    await Student.update(id, { firstName, lastName, email, age, modifiedBy });
    logger.info(`Student updated: ${id} by Admin ID: ${modifiedBy}`);
    
    return { id, firstName, lastName, email, age };
  }

  static async deleteStudent(id) {
    const student = await Student.findById(id);
    if (!student) {
      throw new Error("Student not found");
    }

    await Student.delete(id);
    logger.info(`Student deleted: ${id}`);
  }
}

module.exports = StudentService;
