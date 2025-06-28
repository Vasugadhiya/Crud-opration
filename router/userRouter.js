const express = require('express')
const route = express.Router()
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');
const upload = require("../middleware/upload");

//================================= User Controllers ================================
route.post("/signup", upload.single('profileImage'), userController.signUp);

route.post("/login", userController.login);

route.put("/update", authMiddleware, userController.updateUser);

route.delete("/delete", authMiddleware, userController.deleteUser);





module.exports = route