const express = require('express');
const app = express();
const mongoose = require('mongoose');

//routes
app.use(express.json());
const userRoute = require('./routes/user');

//dotenv
const dotenv = require('dotenv');
dotenv.config();

//mongoose
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected'))
    .catch((err) => console.log(err));

//api
app.use('/api/user', userRoute);

//server
const PORT = 5000;
app.listen(process.env.PORT || PORT, () => {
    console.log('App is running on ', PORT);
});
