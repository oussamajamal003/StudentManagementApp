const express = require("express");
const studentController = require("../controllers/student-controllers");

// Guards
const authGuard = require("../guards/auth.guard");
const roleGuard = require("../guards/role.guard");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: The student management API
 */

// Apply auth guard to all student routes
router.use(authGuard);

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Returns the list of all students (Admin only)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/", roleGuard("admin"), studentController.getStudents);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID (Admin only)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The student ID
 *     responses:
 *       200:
 *         description: The student data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/:id", roleGuard("admin"), studentController.getStudentById);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student (Admin only)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       201:
 *         description: The student was created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student created successfully
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Student already exists
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/", roleGuard("admin"), studentController.createStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student (Admin only)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - age
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               age:
 *                 type: integer
 *             example:
 *               first_name: John
 *               last_name: Doe
 *               email: john.doe@example.com
 *               age: 21
 *     responses:
 *       200:
 *         description: The student was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put("/:id", roleGuard("admin"), studentController.updateStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student (Admin only)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The student ID
 *     responses:
 *       200:
 *         description: The student was deleted
 *       404:
 *         description: Student not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete("/:id", roleGuard("admin"), studentController.deleteStudent);

module.exports = router;
