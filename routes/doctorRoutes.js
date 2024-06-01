const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorController");

//POST SINGLE DOC INFO
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);

//POST UPDATE PROFILE
router.post('/updateProfile', authMiddleware, updateProfileController);

//POST GET SINGLE DOC INFO
router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

//GET Appointments
router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController);

//POST UPDATE APPOINTMENT STATUS
router.post('/update-status', authMiddleware, updateStatusController);

module.exports= router;