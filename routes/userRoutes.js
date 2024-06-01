const express = require("express");
const {
  getAllDoctorsController,
    deleteAllNotificationController,
  getAllNotificationController,applyDoctorController,
  loginController,
  registerController,
  authController,
  bookAppointmentController,
  bookingAvailibilityController,
  userAppointmentsController,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

//router object

const router = express.Router();

//routes

//LOGIN  ||  POST
router.post("/login",loginController);

//REGISTER || POST
router.post("/register",registerController);

//Auth || POST
router.post("/getUserData", authMiddleware , authController);

//Apply Doctor || POST
router.post("/apply-doctor", authMiddleware , applyDoctorController);

//Notification Doctor || POST
router.post("/get-all-notification", authMiddleware , getAllNotificationController);

//Notification Doctor || POST
router.post("/delete-all-notification", authMiddleware , deleteAllNotificationController);

//GET ALL DOC
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

//BOOK APPOINTMENT
router.post('/book-appointment', authMiddleware, bookAppointmentController);

//BOOKING AVAILIBILITY
router.post('/booking-availibility', authMiddleware, bookingAvailibilityController);

//Appointments List
router.get('/user-appointments', authMiddleware, userAppointmentsController);

module.exports = router;