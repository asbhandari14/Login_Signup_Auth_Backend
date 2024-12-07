import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let connection;

export const connectToDatabase = async () => {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "AkashSingh@8595$", 
        database: "auth",
      });
    }
    return connection;
  } catch (err) {
    console.log(err);
  }
};