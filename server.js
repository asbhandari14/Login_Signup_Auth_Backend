import express from "express";
import cors from "cors";
import authRouter from "./routers/authRouter.js"
import dotenv from "dotenv";
dotenv.config();


const app = express();

const PORT = process.env.PORT;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.get("/", (req, res) => {
    res.send("Welcome to the Home page");
})


app.listen(PORT, () => {
    console.log("Server is running at the PORT : ", PORT);
})