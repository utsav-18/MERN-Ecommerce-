import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoute from "./routes/cart.js"
import addressRoutes from './routes/address.js';
import orderRoutes from './routes/order.js';

dotenv.config();

const app  = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth' , authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart', cartRoute);
app.use('/api/address', addressRoutes);
app.use('/api/order', orderRoutes);

const port = 1000;

app.get('/',(req,res) => {
    res.send('API is Running');
});

connectDB();

app.listen(port , ()=>{
    console.log(`http://localhost:${port}`);
})
