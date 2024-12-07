import express from "express";
import cors from "cors";
import authRouter from "./routers/authRouter.js"
import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



const app = express();

const PORT = process.env.PORT;

const corsOptions = {
    origin: 'https://login-signup-auth-frontend.onrender.com', 
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  };
  
  app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.get("/", (req, res)=>{
    console.log(res.send("Welcome to the Home page"))
})


app.listen(PORT, () => {
    console.log("Server is running at the PORT : ", PORT);
})