import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  "name":{type:String,required:true},
  "email":{
    type:String,
    required:true,
    unique:true,
    validate:function(email) {
      return /@/.test(email);
    }
  },
  "passwordHash":{type:String,required:true},
  "sites_id":[String]
});

const User = model('User', userSchema);

export default User;
