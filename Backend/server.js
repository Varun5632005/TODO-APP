//create server
import express from "express";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import { userRoute } from "./APIs/UserAPI.js";
import { verifyToken } from "./middlewares/verifyToken.js";
import { UserModel } from "./models/UserModel.js";

import cors from "cors";
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//enable compression
app.use(compression());

//enable cors
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
//add body parser middleware
app.use(express.json());
//add cookie parser middleware
app.use(cookieParser());

// serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

//if path starts with /user-api. forward req to UserROute
app.use("/user-api", userRoute);

import startEmailScheduler from './cron/emailScheduler.js';

//connect to db
async function connectDBAndStartServer() {
  try {
    //connect to database server
    await connect(process.env.MONGODB_URI);
    console.log("DB connection success");
    
    // Start the cron job for email notifications
    startEmailScheduler();

    //start HTTP server
    const port = process.env.PORT || 8000;
    app.listen(port, console.log(`server listening on port ${port}`));
  } catch (err) {
    console.log("Err in DB connection :", err);
  }
}

connectDBAndStartServer();


//page refresh route

app.get("/refresh",verifyToken,async (req,res)=>{
  console.log("user is",req.user)
  let userObj=await UserModel.findOne({email:req.user.email}).select("-password");
  res.status(200).json({message:"user verified",payload:userObj})
})

// Catch-all route to serve the React app (only in environments where frontend is co-located)
import { existsSync } from 'fs';
const frontendDistPath = path.join(__dirname, '../frontend/dist/index.html');
if (existsSync(frontendDistPath)) {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.use((req, res) => {
    res.sendFile(frontendDistPath);
  });
}
