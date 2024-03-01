import express from 'express';
import cors from 'cors';
import authRouter from './routes/Auth.js';

const app = express();

app.use(express.json()); //req.body
app.use(cors());

app.use('/auth', authRouter);

app.listen(5000, () => {
    console.log("server is running on port 5000");
});