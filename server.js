const express=require('express');
const dotenv = require('dotenv');
const cors=require('cors');
const cookieParser=require('cookie-parser')
const mongoose=require('mongoose');



dotenv.config()
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true}))
mongoose.connect(process.env.MONGODB_LINK, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(data => console.log("database connected succesfully👍"))
    .catch(err => console.error(err))
app.use(require('./Routes/Login_register'))


app.listen(process.env.PORT,()=>console.log("SUCESSFULLY RUNNING ON PORT"))

