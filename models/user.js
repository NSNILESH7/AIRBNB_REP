const { required } = require("joi");
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const pasportLocalmongoosh=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(pasportLocalmongoosh);
module.exports=mongoose.model("user",userSchema);