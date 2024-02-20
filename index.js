const express = require('express');
const app = express();
const mongoose = require('mongoose');

//routes
app.use(express.json());
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');

//dotenv
const dotenv = require('dotenv');
dotenv.config();

//mongoose
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected'))
    .catch((err) => console.log(err));

//api
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);

//server
const PORT = 5000;
app.listen(process.env.PORT || PORT, () => {
    console.log('App is running on ', PORT);
});
