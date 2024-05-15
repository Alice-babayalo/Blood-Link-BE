import mongoose from "mongoose";


const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["donar", "hospital"],
    default: "donar",
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


const AdminModel = mongoose.model("User", AdminSchema);
export default AdminModel;