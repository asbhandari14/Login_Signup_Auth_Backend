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

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.get("/", (req, res)=>{
    console.log(res.send("Welcome to the Home page"))
})


app.listen(PORT, () => {
    console.log("Server is running at the PORT : ", PORT);
})