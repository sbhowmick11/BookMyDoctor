const mongoose=require('mongoose');
const colors=require('colors');


const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Connected ${mongoose.connection.host}`.bgMagenta);
    }
    catch(error)
    {
        console.log(`MongoDB Server Issue ${error}`.bgRed.white);
    }
}

module.exports=connectDB;