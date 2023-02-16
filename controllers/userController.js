const User = require("../models/user")
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require("../config/index")

exports.index = function (req, res, next) {
  res.status(200).json({
    fullname: "Jirapon Tresup",
  });
};

exports.bio = function (req, res, next) {
  res.status(200).json({
    fullname: "Jirapon Tresup",
    Nickname: "Earth",
    hobby: "Gaming",
    gitusername: "EarthChaotic",
  });
};

exports.register = async(req,res,next) =>{
try {
  const {name , email , password} = req.body

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      const error = new Error("Invalid Email")
      error.statusCode = 422;
      error.validation = errors.array()
      throw error;
  }
  const existEmail = await User.findOne({ email:email })
  if(existEmail){
    const error = new Error("อีเมลถูกใช้แล้ว")
    error.statusCode = 400
    throw error;
  }

  let user = new User()
  user.name = name
  user.email = email
  user.password = await user.encryptpassword(password)

  await user.save()

  res.status(201).json({
    message:"Register done"
  })
}
catch(error){
  next(error)
}
}

exports.login = async(req,res,next) =>{
  try{
      const {email, password} = req.body

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          const error = new Error("Invalid Data")
          error.statusCode = 422;
          error.validation = errors.array()
          throw error;
      }
      const user = await User.findOne({email:email})

      if(!user){
          const error = new Error("Cannot find user")
          error.statusCode = 404
          throw error;
      }

      const isValid = await user.checkPassword(password)

      if(!isValid){
          const error = new Error("Password Incorrect")
          error.statusCode = 401
          throw error;
      }
      //create token
      const token = await jwt.sign({
          id:user._id,
          role:user.role,
      },config.PRIVATE_KEY
      ,{expiresIn: "5 days"})

      const expires_in = jwt.decode(token)

      res.status(200).json({
          access_token:token,
          expires_in:expires_in.exp,
          token_type:'Bearer'
      })
  }
  catch(error){
      next(error)
  }
}

exports.profile = (req,res,next) => {
  const{role,name,email} = req.user
  res.status(200).json({
    name:name,
    email:email,
    role:role,
  })
}
