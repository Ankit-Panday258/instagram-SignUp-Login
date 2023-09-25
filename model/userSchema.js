const mongoose = require('mongoose');
const { Schema } = mongoose ;
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  name: {
      type: String ,
      required: [true , 'user name is Required'],
      mexLength: [50,'Name must be less than 50 char'],
      trim:true
  },
  email: {
    type: String ,
    required:[true ,'user email is required'],
    unique:true,
    lowercase:true,
    unique:[ true, 'already registered']
    
  },
  password: {
    type: String,
    select: false ,
  },
  forgotPasswordToken: {
    type: String ,
  }

},{
    timestamps:true
});

userSchema.pre('save' , async function(next){
  if (!this.isModified('password')){
    return next();
  }
  this.password = await bcrypt.hash(this.password,10);
  return next();
})

// signin Token 
userSchema.methods = {
  jwtToke(){
    return JWT.sign(
      {id: this._id, email: this.email },
      process.env.SECRET,
      {expiresIn: '24h'}
    )
  }
}
const userModel = mongoose.model('user' , userSchema);
module.exports = userModel ;