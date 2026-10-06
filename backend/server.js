import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app  = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth' , authRoutes);

const port = 1000;

app.get('/',(req,res) => {
    res.send('API is Running');
});

connectDB();

app.listen(port , ()=>{
    console.log(`http://localhost:${port}`);
})
