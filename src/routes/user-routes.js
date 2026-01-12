const express = require("express");
const usersController = require("../controllers/users-controllers");
const { validateSignup, validateLogin } = require("../validator/authValidator");

const router = express.Router();

// User routes
router.get("/", usersController.getUsers);
router.post("/signup", validateSignup, usersController.signup);
router.post("/login", validateLogin, usersController.login);
router.post("/logout", usersController.logout);

module.exports = router;
