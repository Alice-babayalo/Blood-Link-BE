import userModel from "../models/user.model.js";
import hospitalModel from "../models/hospital.model.js";
import jwt from "jsonwebtoken"
import asyncWrapper from "../middleware/async.js";
import bcryptjs from 'bcryptjs';
import { BadRequestError } from "../errors/index.js";
import { validationResult } from "express-validator";
import { sendEmail } from "../utils/sendEmail.js";
import { otpGenerator } from "../utils/otp.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import crypto from "crypto"



export const SignUp = asyncWrapper(async (req, res, next) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestError(errors.array()[0].msg));
  }

  // Checking if the user is already in using the email
  const foundUser = await userModel.findOne({ email: req.body.email });
  if (foundUser) {
    return next(new BadRequestError("Email already in use"));
  };

  // Harshing the user password
  const hashedPassword = await bcryptjs.hashSync(req.body.password, 10);

  // Generating OTP
  const otp = otpGenerator();
  const otpExpirationDate = new Date().getTime() + (60 * 1000 * 5);

  // Recording the user to the database
  const newUser = new userModel({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    otp,
    otpExpires: otpExpirationDate,
    verified: false

  });

  const savedUser = await newUser.save();

  await sendEmail(req.body.email, "Verify your account", `Your OTP is ${otp}\n You have five minutes to verify your account.`);

  if (savedUser) {
    return res.status(201).json({
      message: "User registered sucessfull!!",
      user: savedUser

    });
  }
});


export const ValidateOpt = asyncWrapper(async (req, res, next) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestError(errors.array()[0].msg));
  }

  // Checking if the given opt is stored in our database
  const foundUser = await userModel.findOne({ otp: req.body.otp });
  if (!foundUser) {
    next(new UnauthorizedError('Authorization denied'));

  };

  // Checking if the otp is expired or not.
  if (foundUser.otpExpires < new Date().getTime()) {
    await userModel.findByIdAndDelete(foundUser._id);
    next(new UnauthorizedError('OTP expired, Please sign up again'));
  }

  // Updating the user to verified
  foundUser.verified = true;
  const savedUser = await foundUser.save();

  if (savedUser) {
    return res.status(200).json({
      message: "User account verified!",
      user: savedUser
    });
  }
});

export const logIn = asyncWrapper(async (req, res, next) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestError(errors.array()[0].msg));
  }

  // Find user
  const foundUser = await userModel.findOne({ email: req.body.email });
  if (!foundUser) {
    foundUser = await hospitalModel.findOne({ email: req.body.email });
    return next(new BadRequestError("Invalid email or password!"));
  };




  // Check account verification
  if (!foundUser.verified) {
    return next(new BadRequestError("Your account is not verified!"));
  }

  // Verify password
  const isPasswordVerfied = await bcryptjs.compareSync(req.body.password, foundUser.password);
  if (!isPasswordVerfied) {
    return next(new BadRequestError("Invalid email or password!"));
  }

  // Generate token
  const token = jwt.sign({ id: foundUser.id, email: foundUser.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

  res.status(200).json({
    message: "User logged in!",
    token: token,
    user: foundUser
  });
});

export const logout = asyncWrapper(async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json("Logout Success");
})
//forgot password
export const forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if(user.verified==false){
    return res.status(403).json({ message: "Your account was not verified" });
  }
  function generateRandomToken() {
    return crypto.randomBytes(20).toString('hex');
  }
  const resetToken = generateRandomToken();
  user.resetToken = resetToken;
  user.resetTokenExpires = Date.now() + (10 * 60 * 1000);
  await user.save();
  const link = `http://localhost:5173/ConfirmNewPassword?token=${resetToken}&id=${user.id}`;
  const emailBody = `Click on the link bellow to reset your password\n\n${link}`;

  await sendEmail(req.body.email, "Reset your password", emailBody);

  res.status(200).json({
    message: "We sent you a reset password link on your email!",
  });
})
//reset password
export const resetPassword = asyncWrapper(async (req, res, next) => {
  const token = req.params.resetToken;
  const user = await userModel.findOne({ resetToken: token });
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
  if (user.resetTokenExpires < Date.now()) {
    return res.status(400).json({ message: 'Token has expired' });
  }
  if (token === user.resetToken) {
    const hashedPassword = await bcryptjs.hashSync(req.body.password, 10);
    user.password = hashedPassword;
    // user.resetToken = undefined;
    // user.resetTokenExpires = undefined;
    await user.save();
    return res.status(200).json({ message: 'Password reseted successfully' });
  }
  else {
    return res.json({ message: 'Invalid token' });
  }
})




