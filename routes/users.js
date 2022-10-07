var express = require('express');
const { dbUrl } = require('../Controllers/DbConfig');
const mongoose = require('mongoose');
const { hashing } = require('../Controllers/Hashing');
const { Users } = require('../Controllers/Schema');
const { forgot_password, sendResetPasswordMail } = require('../Controllers/UserController');
const randomstring= require("randomstring");
const nodemailer=require("randomstring");
var router = express.Router();
const dbConnect=async()=>{
  try {
      await mongoose.connect(
          dbUrl,
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
          }
        );
        console.log("DB Connected");
  } catch (error) {
      console.log(error.message,dbUrl, process.env.DB_URL,"error in connecting db");
  }
}
dbConnect();

/* GET users listing. */
router.post('/forget',async(req,res)=>{
  try {
      const userdata =await Users.findOne({email:req.body.email})

      console.log(userdata)
      if(userdata){
          const randomString= randomstring.generate();
          let email1 =req.body.email
          const data=await Users.updateOne({email:email1},{$set:{token:randomString}})
          sendResetPasswordMail(userdata.name,userdata.email,randomString)
          res.status(200).send({
              success:true,
              msg:randomString
          })
      }
      else
      {
        res.status(200).send({
          
          msg:"userdata not found"
      })
      }
  } catch (error) {
    res.status(200).send({
      
      msg:error
    })
    
  }
});
//forgot password
router.post('/create',async(req,res)=>{
  try {
    let hashedPassword = await hashing(req.body.password)
    req.body.password=hashedPassword
    const data= await Users.create({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password
    })
    res.send({statusCode:200,
      message:"User Created",
      payload:data,
    
    })
  } catch (error) {
    
  }
});

router.post('/reset',async(req,res)=>{
  try {
    
    const token= req.query.token
    const tokenData=await Users.findOne({token:token});

    if(tokenData){
      const password=req.body.password;
      const newpassword=await hashing(password)
      
      const change= await Users.findByIdAndUpdate({ _id:tokenData._id },{$set:{password:newpassword,token:' '}},{new:true})
      res.status(200).send({success:true,msg:"password changed"})
    }
    else{
      res.status(400).send({success:false,msg:"wrong token"})
    }
  } catch (error) {

    
    res.status(404).send(tokenData._id)
  }

    
})

module.exports = router;
