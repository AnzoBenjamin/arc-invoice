import jwt from "jsonwebtoken";
import User from '@models/userModel';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import ProfileModel from '@models/profileModel';
import { RequestHandler } from 'express';

dotenv.config();

interface UserCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
}

interface ResetPasswordData {
  password: string;
  token: string;
}

interface UserDocument extends Document {
  email: string;
  password: string;
  resetToken?: string;
  expireToken?: number;
  save: () => Promise<UserDocument>;
}

interface UserModel extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  bio?: string;
}

const SECRET = process.env.SECRET;
const HOST = process.env.SMTP_HOST;
const PORT = process.env.SMTP_PORT;
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;

// Sign in user
export const signin: RequestHandler<{}, {}, UserCredentials> = async (
  req,
  res
) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(404).json({ message: "User doesn't exist" });
      return;
    }

    const userProfile = await ProfileModel.findOne({ userId: existingUser._id });
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, userProfile, token });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Something went wrong" 
    });
  }
};

// Sign up user
export const signup: RequestHandler<{}, {}, UserCredentials> = async (
  req,
  res
) => {
  const { email, password, confirmPassword, firstName, lastName, bio } = req.body;
console.log(req.body)
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords don't match" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      bio,
    }).then(doc => doc.toObject()) as UserModel;

    const userProfile = await ProfileModel.findOne({ userId: result._id });
    const token = jwt.sign(
      { email: result.email, id: result._id },
      SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result, userProfile, token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Something went wrong" 
    });
  }
};

// Forgot password
export const forgotPassword: RequestHandler<{}, {}, { email: string }> = async (
  req,
  res
) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    host: HOST,
    port: Number(PORT),
    auth: {
      user: USER,
      pass: PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      crypto.randomBytes(32, (err, buffer) => {
        if (err) reject(err);
        resolve(buffer);
      });
    });

    const token = buffer.toString("hex");
    const user = await User.findOne({ email });

    if (!user) {
      res.status(422).json({ error: "User does not exist in our database" });
      return;
    }

    user.resetToken = token;
    user.expireToken = Date.now() + 3600000;
    await user.save();

    await transporter.sendMail({
      to: user.email,
      from: "Accountill <hello@accountill.com>",
      subject: "Password reset request",
      html: `
        <p>You requested for password reset from Arc Invoicing application</p>
        <h5>Please click this <a href="https://accountill.com/reset/${token}">link</a> to reset your password</h5>
        <p>Link not clickable?, copy and paste the following url in your address bar.</p>
        <p>https://accountill.com/reset/${token}</p>
        <P>If this was a mistake, just ignore this email and nothing will happen.</P>
      `,
    });

    res.json({ message: "Check your email" });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Something went wrong" 
    });
  }
};

// Reset password
export const resetPassword: RequestHandler<{}, {}, ResetPasswordData> = async (
  req,
  res
) => {
  const { password, token: sentToken } = req.body;

  try {
    const user = await User.findOne({
      resetToken: sentToken,
      expireToken: { $gt: Date.now() },
    });

    if (!user) {
      res.status(422).json({ error: "Try again session expired" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.expireToken = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Something went wrong" 
    });
  }
};
