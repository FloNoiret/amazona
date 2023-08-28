import express from "express";
import data from "./data.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/UserRoutes.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then (() => {
  console.log('Connected to db');
}) .catch (err => {
  console.log(err.message)
})

const app = express();

// Convert to object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Export Sample Products API
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);


// Error message if server pb
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Set the localhost port
const port = process.env.PORT || 5000; 
app.listen(port, () => {
    console.log (`Serve at http://localhost:${port}`)
});