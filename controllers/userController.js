const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require('moment');


//register callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ success: false, message: "User already exists.Please login" });
    } else {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;

      const newUser = new userModel(req.body);
      await newUser.save();
      res
        .status(201)
        .send({ message: "Registered successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller  ${error.message}`,
    });
  }
};

//login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User is not registered", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });
    }
    //token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    res
      .status(200)
      .send({ message: "Logged In Successfully", success: true, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: `Error in Login Controller ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "auth error", success: false, error });
  }
};

//Apply Doctor Controller
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "Pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Applied for Doctor Account Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while Applying for Doctor",
    });
  }
};

//notification controller
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notifications are marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

//delete notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    //empty both notification and seennotification array
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.staus(500).send({
      success: false,
      message: "Unable to delete all Messages",
      error,
    });
  }
};

//GET ALL DOC
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "Approved" });
    res.status(200).send({
      success: true,
      message: "Doctors List was fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching Doctors",
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    req.body.status = "Pending";
    
    req.body.date = moment(req.body.date ,'YYYY-MM-DD').toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
       

    

    // Parse doctorInfo and userInfo from JSON strings
    const doctorInfo = JSON.parse(req.body.doctorInfo);
    const userInfo = JSON.parse(req.body.userInfo);

    // Create a new appointment with the parsed data
    const newAppointment = new appointmentModel({
      ...req.body,
      doctorInfo,
      userInfo,
    });
    await newAppointment.save();

    // Find the doctor by userId from the parsed doctorInfo
    const doctor = await userModel.findOne({ _id: doctorInfo.userId });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    // Add a notification to the doctor's notifications
    doctor.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await doctor.save();

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while booking appointment",
    });
  }
};

const bookingAvailibilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(30, "minutes")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(30, "minutes").toISOString();
    const doctorId = req.body.doctorId;

    // Fetch appointments that are not rejected
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
      status: { $ne: "Rejected" }, // Excluding Rejected appointments
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message:
          "Sorry! Appointment is not available for the selected time slot",
        success: false, 
      });
    } else {
      return res.status(200).send({
        message: "Hurray! Appointment is available for the selected time slot",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Booking",
    });
  }
};

module.exports = bookingAvailibilityController;

const userAppointmentsController  = async(req,res) =>{

  try
  {
    const appointments = await appointmentModel.find({userId:req.body.userId});
    res.status(200).send({
      success: true,
      message:'User Appointments was fetched successfully',
      data:appointments
    })
  }
  catch(error)
  {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message:'Error in user appointments'
    })
  }
}

module.exports = {
  userAppointmentsController,
  bookingAvailibilityController,
  bookAppointmentController,
  deleteAllNotificationController,
  getAllDoctorsController,
  getAllNotificationController,
  applyDoctorController,
  loginController,
  registerController,
  authController,
};
