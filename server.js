const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');



dotenv.config()
const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// !To add /Api as starting rout to all Routes 
// app.use((req, res, next) => {
//     req.url = '/Api' + req.url;
//     next();
// });
mongoose.connect(process.env.MONGODB_LINK, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(data => console.log("database connected succesfully👍"))
    .catch(err => console.error(err))
    app.use("/Api/User", require('./Routes/User.js'))
    app.use("/Api", require('./Routes/Login_register'))


app.listen(process.env.PORT, () => console.log("SUCESSFULLY RUNNING ON PORT"))

