const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPfp } = require('../middlewares/uploads');
const userController = require('../controllers/userController')

const route = express.Router();

route.post('/register', userController.register)

route.post('/login', userController.login)

route.post('/logout', authMiddleware, userController.logout)

route.get(`/profile`, authMiddleware, userController.profile)

route.put("/modifyUser", uploadPfp.single('profileImage'), authMiddleware, userController.modifyUserRoute)

route.get("/borbelyok", userController.borbelyok)

route.get("/borbelyokNeve", userController.borbelyokNeve)

route.delete("/deleteUser", authMiddleware, userController.deleteUserRoute)

/*
admin
*/

route.post('/admin/login', userController.adminLogin)

route.post('/admin/createUser', authMiddleware, isAdmin, userController.adminCreateUser)

route.put("/admin/modifyUser", authMiddleware, isAdmin, userController.adminModifyUserRoute)

route.delete("/admin/deleteUser", authMiddleware, isAdmin, userController.adminDeleteUserRoute)

route.post("/admin/getUserByName", authMiddleware, isAdmin, userController.adminGetUserByName)

route.post("/admin/getUserByEmail", authMiddleware, isAdmin, userController.adminGetUserByEmail)

module.exports = route;

