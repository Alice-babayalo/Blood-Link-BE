import mongoose from "mongoose";


const userchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["donor", "hospital", "admin"],
    default: "donor"
  },

  otp: {
    type: Number,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  resetToken: {
    type: String,
    required: false
  },
  otpExpires:{
    type: Date
  },
  resetTokenExpires: {
    type: String,
    required: false
  }

}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});


const userModel = mongoose.model("User", userchema);
export default userModel;