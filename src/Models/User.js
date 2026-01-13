const pool = require("../config/db");

class User {
  static async findAll() {
    const [rows] = await pool.query("SELECT user_id, username, email, role, createdAt FROM users");
    return rows;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  static async create({ username, email, password, role = 'user' }) {
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, password, role]
    );
    return result.insertId;
  }

  static async findById(id) {
     const [rows] = await pool.query("SELECT user_id, username, email, role, createdAt FROM users WHERE user_id = ?", [id]);
     return rows[0];
  }
}

module.exports = User;
