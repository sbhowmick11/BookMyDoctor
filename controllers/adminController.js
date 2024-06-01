const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      messsage: "Users Data List",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
    try
    {
        const doctors = await doctorModel.find({});
        res.status(200).send({
          success: true,
          messsage: "Doctors Data List",
          data: doctors,
        });
    }
    catch(error)
    {
        console.log(error);
         res.staus(500).send({
           success: false,
           message: "Error while fetching doctors",
           error,
         });
        
    }
};

//doctor account status
const changeAccountStatusController = async(req,res) =>{

  try
  {
    const {doctorId, status} = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId,{status});
    const user = await userModel.findOne({_id:doctor.userId});
    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account request has been ${status}`,
      onClickPath: "/notification",
    });

    user.isDoctor = status === 'Approved'?true:false;
    await user.save();
    res.status(200).send({
      success:true,
      message:'Account Status upgraded successfully',
      data:doctor,
    })
  }
  catch(error)
  {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in updating Account Status',
      error
    })
  }

}

//Delete Account
const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    await userModel.findByIdAndDelete(userId);
    res.status(200).send({
      success: true,
      message: "User has been deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting user",
      error,
    });
  }
};
module.exports = {
  deleteUserController,changeAccountStatusController,
  getAllDoctorsController,
  getAllUsersController,
};
