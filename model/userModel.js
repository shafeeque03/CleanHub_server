const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      number: {
        type: Number,
        required: true,
      },
      password: {
        type:String,
        required:true
      },
      is_blocked: {
        type: Boolean,
        default:false
      },
      is_verified:{
        type: Boolean,
        default: true
      },
      location: {
        type: String,
        required: true
      },
      isRequested: {
        type: Boolean,
        default: false
      },
      CH_id: {
        type: String,
        required: true
      }
});

const user = mongoose.model("user", userSchema);
module.exports = user;