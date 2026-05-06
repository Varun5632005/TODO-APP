//create min-express app
import express from "express";
import { hash, compare } from "bcryptjs";
import { UserModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
const { sign } = jwt;
export const userRoute = express.Router();

//Define API routes

//Route for User registration
userRoute.post("/user", async (req, res) => {
  try {
    //get user obj
    let newUser = req.body;
    //hash password
    let hashedPassword = await hash(newUser.password, 12);
    //replace plain password with hashed password
    newUser.password = hashedPassword;
    //create new user doc
    let newUserDoc = new UserModel(newUser);
    //save in db
    await newUserDoc.save();
    //send res
    res.status(201).json({ message: "user created" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Route for User authentication(Login)
userRoute.post("/login", async (req, res) => {
  try {
    //get user cred obj
    let credObj = req.body;
    //check email
    let userInDb = await UserModel.findOne({ email: credObj.email });
    //if user not found
    if (userInDb === null) {
      res.status(404).json({ message: "You are not registered. Please register to login." });
    } else {
      //compare password
      let isEqual = await compare(credObj.password, userInDb.password);
      //if passwords not matched
      if (isEqual === false) {
        res.status(404).json({ message: "Incorrect password. Please try again." });
      } else {
        //generate token
        let encodedToken = sign({ email: userInDb.email }, process.env.JWT_SECRET || "abcdef", { expiresIn: "1h" });
        //save in cookies
        res.cookie("token", encodedToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        let userToSend = userInDb.toObject();
        delete userToSend.password;
        //send res
        res.status(200).json({ message: "login success", payload: userToSend });
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})


//Logout User
userRoute.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true 
  });
  //res
  res.status(200).json({ message: "Logout success" });
});

// Update Profile Route
userRoute.put("/update-profile/:userid", async (req, res) => {
  try {
    const { name } = req.body;
    let updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.params.userid },
      { $set: { name } },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "Profile updated", payload: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete User Route
userRoute.delete("/user/:userid", async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.userid);
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true 
    });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Route for Forgot Password
userRoute.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Create reset url
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #6366f1;">Password Reset Request</h2>
        <p>You requested a password reset. Please click the link below to reset your password. This link is valid for 15 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        to: user.email,
        from: `"TaskMaster Support" <${process.env.EMAIL_USER}>`,
        subject: "Password Reset Request",
        html: message,
      });

      res.status(200).json({ message: "Email sent successfully!" });
    } catch (err) {
      console.error("Nodemailer error: ", err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: `Email failed: ${err.message}` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Route for Reset Password
userRoute.put("/reset-password/:resetToken", async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    const user = await UserModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set new password
    const newPassword = await hash(req.body.password, 12);
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Route to add new todo
userRoute.put("/todo/:userid", async (req, res) => {
  //get new task obj
  let newTask = req.body;
  //get userid from url
  let uid = req.params.userid;
  //push new task to "todos" array of user obj
  let userAfterAddingTodo = await UserModel.findOneAndUpdate(
    { _id: uid },
    { $push: { todos: newTask } },
    { new: true }
  ).select("-password");
  //send res
  res.status(200).json({ message: "todo added", payload: userAfterAddingTodo });
});

//Route to edit task
userRoute.put("/edit-todo/userid/:userid/taskid/:taskid", async (req, res) => {
  try {
    //get userid and taskid from url params
    let { userid, taskid } = req.params; //{userid:"",taskid:""}
    //get modified task obj
    let modifiedTaskObj = req.body;
    //update task
    let userWithModifiedTask = await UserModel.findOneAndUpdate(
      { _id: userid, "todos._id": taskid },
      {
        $set: {
          "todos.$.taskName": modifiedTaskObj.taskName,
          "todos.$.description": modifiedTaskObj.description,
          "todos.$.dueDate": modifiedTaskObj.dueDate,
          "todos.$.status": modifiedTaskObj.status,
        },
      },
      { new: true }
    ).select("-password");

    //send res
    res.status(200).json({ message: "task modified", payload: userWithModifiedTask });
  } catch (err) {}
});

//Route to set task as completed
userRoute.put("/edit-status/userid/:userid/taskid/:taskid", async (req, res) => {
  try {
    //get userid and taskid from url params
    let { userid, taskid } = req.params; //{userid:"",taskid:""}

    //update task by changing status to "completed"
    let userWithModifiedTask = await UserModel.findOneAndUpdate(
      { _id: userid, "todos._id": taskid },
      {
        $set: {
          "todos.$.status": "completed",
        },
      },
      { new: true }
    ).select("-password");

    //send res
    res.status(200).json({ message: "task status modified", payload: userWithModifiedTask });
  } catch (err) {}
});

//Route to delete a task
userRoute.put("/delete-todo/userid/:userid/taskid/:taskid", async (req, res) => {
  try {
    //get userid and taskid from url params
    let { userid, taskid } = req.params; //{userid:"",taskid:""}

    //update task by changing status to "completed"
    let userWithModifiedTask = await UserModel.findOneAndUpdate(
      { _id: userid },
      { $pull: { todos: { _id: taskid } } },
      { new: true }
    ).select("-password");

    //send res
    res.status(200).json({ message: "task deleted", payload: userWithModifiedTask });
  } catch (err) {}
});
