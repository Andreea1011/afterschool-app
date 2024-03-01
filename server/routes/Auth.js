import pool from '../db.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwtGenerator from '../utils/jwtGenerator.js';

const router = express.Router();

router.post('/register',
    async (req, res) => {
        try {
            const {name, email, password} = req.body;

            //check if user exists
            //TODO: Validate emails beforehand, suggestion: regex (plenty online)
            const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

            if (user.rows.length !== 0) {
                return res.status(401).send("User already exists");
            }

            //bcrypt the user pass
            const salt = await bcrypt.genSalt(10);
            const bcryptPassword = await bcrypt.hash(password, salt);

            //enter new user inside database
            const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [name, email, bcryptPassword]);
            const user_id = newUser.rows[0]["user_id"]

            //generate jwt token
            const token = jwtGenerator(user_id);
            res.json({token});

        } catch (err) {
            console.error(err.message);
            res.status(500).send("server error"); //TODO: define comprehensive errors
        }
    }
)

router.post('/login',
    async (req, res) => {
        try {
            const {email, password} = req.body;

            //check if user exists
            const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

            if (user.rows.length === 0) {
                return res.status(401).send("Pass/email incorrect");
            }

            const validPass = await bcrypt.compare(password, user.rows[0]["user_password"]);

            if (!validPass) {
                return res.status(401).json("Pass/email incorrect");
            }

            //give the jwt token
            const token = jwtGenerator(user.rows[0]["user_id"]);
            res.json({token});

        } catch (err) {
            console.error(err.message);
            res.status(500).send("server error");
        }
    }
)

export default router;