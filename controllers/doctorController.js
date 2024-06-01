const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");

const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Doctor Details",
    });
  }
};

//update doc profile
const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile was updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating doctor profile",
      error,
    });
  }
};

//get single doctor

const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Single doctor info fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting single doctor info",
    });
  }
};

const doctorAppointmentsController = async (req, res) => {
  try {
    // console.log("userId:", req.body.userId);

    console.log(req.body);
    // const doctor = await doctorModel.findOne({ userId: req.body.doctorId });
    // if (!doctor) {
    //   return res.status(404).send({
    //     success: false,
    //     message: "Doctor not found",
    //   });
    // }
    const appointments = await appointmentModel.find({ 'doctorInfo.userId': req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor appointments were fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching doctor appointments",
    });
  }
};


const updateStatusController = async(req,res) =>{
    try
    {
        const {appointmentsId, status} = req.body;
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId, {status});
        const user = await userModel.findOne({ _id: appointments.userId });

        // Add a notification to the doctor's notifications
        const notification = user.notification;
        notification.push({
          type: "Status was Updated",
          message: `Your appointment has been ${status}`,
          onClickPath: "/doctor-appointments",
        });
        await user.save();
        res.status(200).send({
            success: true,
            message:'Appointment status was updated'
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in Updating of Status'
        })
    }
}

module.exports = {
    updateStatusController,
  getDoctorByIdController,
  getDoctorInfoController,
  updateProfileController,
  doctorAppointmentsController,
};
