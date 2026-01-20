const pool = require("../config/db");

class Student {
  static async findAll() {
    // Return all students ordered by newest first
    const [rows] = await pool.query("SELECT * FROM students ORDER BY created_at DESC");
    return rows;
  }

  static async count({ search }) {
    let query = "SELECT COUNT(*) as count FROM students";
    const params = [];

    if (search) {
      query += " WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].count;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM students WHERE email = ?", [email]);
    return rows[0];
  }

  static async create({ firstName, lastName, email, age, createdBy }) {
    try {
      const [result] = await pool.query(
        "INSERT INTO students (first_name, last_name, email, age, created_by, modified_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
        [firstName, lastName, email, age, createdBy, createdBy]
      );
      return result.insertId;
    } catch (error) {
      console.error("Database Insert Error:", error.message);
      throw error;
    }
  }

  static async update(id, { firstName, lastName, email, age, modifiedBy }) {
    await pool.query(
      "UPDATE students SET first_name = ?, last_name = ?, email = ?, age = ?, modified_by = ?, updated_at = NOW() WHERE id = ?",
      [firstName, lastName, email, age, modifiedBy, id]
    );
  }

  static async delete(id) {
    await pool.query("DELETE FROM students WHERE id = ?", [id]);
  }
}

module.exports = Student;
