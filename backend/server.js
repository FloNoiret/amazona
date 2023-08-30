import express from "express";
import path from 'path';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/UserRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';

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


//API
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

// Local API
app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// Server Heroku Path
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);


// Error message if server pb
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Set the localhost port
const port = process.env.PORT || 5000; 
app.listen(port, () => {
    console.log (`Serve at http://localhost:${port}`)
});