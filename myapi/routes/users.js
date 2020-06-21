var express = require('express');
var router = express.Router();
var User=require('../models/user')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config=require("config")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',async function(req, res) {
  let oneuser=await User.findOne({email:req.body.email})
  if (oneuser){
    return res.status("400").send("User with given email alreday exists")
  }
  
  let users= new User()
  users.username=req.body.username;
  users.email=req.body.email;
  users.password=req.body.password;
  users.password= await bcrypt.hash(req.body.password,10)

  await users.save()

  return  res.send(users)
  
});

router.post('/login',async function(req,res){
  let user=await User.findOne({email:req.body.email})
  
if(!user )   return res.status(400).send("Not registred")
let isvalid= await bcrypt.compare(req.body.password,user.password)

if(!isvalid) return res.status(401).send("Not valid password")

let token=jwt.sign({_id:user._id,username:user.username },config.get("jwtPrivateKey"))

res.send(token)



})

module.exports = router;
