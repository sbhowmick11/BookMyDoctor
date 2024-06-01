const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const {changeAccountStatusController , getAllUsersController, 
    getAllDoctorsController, 
    deleteUserController} = require('../controllers/adminController');

const router = express.Router();

//GET METHOD || USERS
router.get('/getAllUsers',authMiddleware,getAllUsersController);

//GET METHOD || DOCTORS
router.get('/getAllDoctors',authMiddleware, getAllDoctorsController);

//POST ACOUNT STATUS
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController);

//DELETE ACCOUNT
router.delete("/deleteUser/:userId", authMiddleware, deleteUserController);





module.exports = router;