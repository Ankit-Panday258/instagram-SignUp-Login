const userModel = require("../model/userSchema");

const emailvalidator = require("email-validator")
const bcrypt = require('bcrypt')

const signup = async(req ,res ,next)=>{
   const {name , email , password , confirmPassword}= req.body;
   console.log(name , email , password , confirmPassword);
 

   if(!name || !email || !password || !confirmPassword){
         return res.status(400).json({
          success: false,
          message: "Every field is reqired"
         })
   }
   

  const validEmail = emailvalidator.validate(email)
  
  if (!validEmail){
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email id "
     })
  }

 if (password!== confirmPassword){
  return res.status(400).json({
    success: false,
    message: "password and confirm Password doesn't match "
   })
 }

   try{
    const userInfo = userModel(req.body);
    const result = await userInfo.save();

    return res.status(200).json({
        success:true,
        data: result
       });
      }catch(e){
        if(e.code === 1100){
          return res.status(400).json({
            success:false,
            message:'Accoun already'
          })
        }
      return res.status(400).json({
        success:false,
        message: e.message
      })
   }
}
//  signin 
const signin = async(req , res , next) =>{
  const {email , password} = req.body;
  
  if (!email || !password){
    return res.status(400).json({
      success: false,
      message: "Every field is mandat"
     });
  }

try{
const user = await userModel
     .findOne({
      email
     })
     .select('+password');
   if (!user || !(await bcrypt.compare (password , user.password ))){
    return res.status(400).json({
      success: false,
      message: "invalid credentials"
     })
   }
  
  //  signin token 
  const token = user.jwtToke();
  user.password = undefined;

  
  const cookieOption = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
   };

   res.cookie("token" , token ,cookieOption)
   res.status(200).json({
      success:true,
      data:user
   })
  }catch(e){
    res.status(400).json({
      success:false,
      message: e.message
   })
  }
  }


  const getUser = async(req,res,next) => {
      const userId = req.user.id ;
      try{
        const user = await userModel.findById(userId)
        return res.status(200).json({
          success:true,
          data:user
        });
      }catch(e){
         return res.status(400).json({
          success:false,
          message:e.message
         })
      }
  }
  // logout 
  const logout = async(req , res ,next) =>{
    try{
      const cookieOption = {
        expires: new Date(),
        httpOnly:true
      };
      res.cookie("token" , null , cookieOption)
      res.status(200).json({
        success:true,
        message:"Logged out"
      })
    }catch(e) {
       res.status(400).json({
        success:false,
        message:e.message
       })
    }
  }
module.exports ={
    signup,
    signin,
    getUser,
    logout
}