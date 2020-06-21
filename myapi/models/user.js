var mongoose=require('mongoose')
const { unsubscribe } = require('../app')

var user_schema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    role:{
        type:String,
        default:"user"
    }

})

var user_model=mongoose.model("users",user_schema)

module.exports =user_model;