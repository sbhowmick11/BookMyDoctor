const mongoose=require('mongoose');

const userScehema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,'Name is required']
    },
    email:{
        type:String,
        required:[true,'Email is required']
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isDoctor:{
        type:Boolean,
        default:false
    },
    notification:{
        type:Array,
        default:[]   
    },
    seennotification:{
        type:Array,
        default:[],  
    }
})


const userModel=mongoose.model('users',userScehema)

module.exports=userModel