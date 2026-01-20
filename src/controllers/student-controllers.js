const StudentService = require("../Services/studentService");
const StudentLog = require("../Models/StudentLog");
const logger = require("../utils/logger");

const getLogContext = (req) => ({
  performedBy: req.user ? req.user.user_id : null,
  ipAddress: req.ip || req.connection.remoteAddress,
  userAgent: req.headers["user-agent"]
});

const getStudents = async (req, res) => {
  try {
    // Return all students (admin only guard applied in routes)
    const students = await StudentService.getAllStudents();
    
    // Log View List
    await StudentLog.logAction({
      ...getLogContext(req),
      action: 'LIST_STUDENTS',
      studentId: null
    });

    return res.status(200).json({ students });
  } catch (error) {
    logger.error(`Get students error: ${error.message}`);
    return res.status(500).json({ error: "Failed to fetch students" });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await StudentService.getStudentById(id);

    // Log View Single
    await StudentLog.logAction({
      ...getLogContext(req),
      action: 'VIEW_STUDENT',
      studentId: id,
      newData: student
    });

    res.status(200).json(student);
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({ error: "Student not found" });
    }
    logger.error(`Get student by ID error: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

const createStudent = async (req, res) => {
  try {
    const { first_name, last_name, email, age } = req.body;
    const adminId = req.user.user_id;

    if (!first_name || !last_name || !email || !age) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await StudentService.createStudent({ 
      firstName: first_name, 
      lastName: last_name, 
      email, 
      age, 
      createdBy: adminId 
    });
    
    // Log Create
    await StudentLog.logAction({
      ...getLogContext(req),
      action: 'CREATE_STUDENT',
      studentId: result.id,
      newData: result
    });

    res.status(201).json({ message: "Student created successfully", student: result });
  } catch (error) {
    if (error.message === "Student with this email already exists") {
      return res.status(409).json({ error: error.message });
    }
    logger.error(`Create student error: ${error.message}`);
    res.status(500).json({ error: "Failed to create student" });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, age } = req.body;
    const adminId = req.user.user_id;

    if (!first_name || !last_name || !email || !age) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Fetch old data for logging
    let oldData = null;
    try {
      oldData = await StudentService.getStudentById(id);
    } catch (ignore) { /* If not found, service update will handle it */ }

    const result = await StudentService.updateStudent(id, { 
      firstName: first_name, 
      lastName: last_name, 
      email, 
      age, 
      modifiedBy: adminId 
    });

    // Log Update
    await StudentLog.logAction({
      ...getLogContext(req),
      action: 'UPDATE_STUDENT',
      studentId: id,
      oldData: oldData,
      newData: result
    });

    res.status(200).json({ message: "Student updated successfully", student: result });
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({ error: "Student not found" });
    }
    if (error.message === "Student with this email already exists") {
      return res.status(409).json({ error: error.message });
    }
    logger.error(`Update student error: ${error.message}`);
    res.status(500).json({ error: "Failed to update student" });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch old data specifically for logging before deletion
    let oldData = null;
    try {
      oldData = await StudentService.getStudentById(id);
    } catch (ignore) { /* If not found, service delete will handle it */ }

    await StudentService.deleteStudent(id);

    // Log Delete
    if (oldData) {
      await StudentLog.logAction({
        ...getLogContext(req),
        action: 'DELETE_STUDENT',
        studentId: id,
        oldData: oldData
      });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({ error: "Student not found" });
    }
    logger.error(`Delete student error: ${error.message}`);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
