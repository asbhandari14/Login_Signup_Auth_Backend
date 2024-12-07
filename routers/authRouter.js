import express from 'express';
import { connectToDatabase } from '../helpers/db.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/register', async (req, res) => {

    const { firstname, lastname, email, countryCode, phone, password, confirmPassword, dob, gender } = req.body;

    // Basic validation
    if (!firstname || !lastname || !email || !countryCode || !phone || !password || !confirmPassword || !dob || !gender) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    // const { username, email, password } = req.body;
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log(rows)
        if (rows.length > 0) {
            return res.status(409).json({ message: "user already existed" })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (first_name, last_name, email, country_code, phone_number, password_hash, date_of_birth, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [firstname, lastname, email, countryCode, phone, hashPassword, dob, gender])

        return res.status(201).json({ success: true, message: "user created successfully" })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err.message);
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "user not existed" })
        }

        const isMatch = await bcrypt.compare(password, rows[0].password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "wrong password" })
        }
        const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET_KEY, { expiresIn: '3h' })

        return res.status(201).json({ success: true, token: token })
    } catch (err) {
        return res.status(500).json(err.message)
    }
})

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "No Token Provided" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.userId = decoded.id;
        next()
    } catch (err) {
        return res.status(500).json({ message: "server error" })
    }
}

router.get('/home', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "user not existed" })
        }

        return res.status(201).json({ success: true, user: rows[0] })
    } catch (err) {
        return res.status(500).json({ message: "server error" })
    }
})

export default router;