const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const fileupload = require("express-fileupload");

const { Server } = require("socket.io");
const messageRoutes = require("./Routes/messageRoutes");

dotenv.config();
const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    // origin:"https://project-dekho.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ endcoded: true, urlencoded: true }));
app.use(
  fileupload({
    useTempFiles: true,
  })
);
// !To add /Api as starting rout to all Routes
// app.use((req, res, next) => {
//     req.url = '/Api' + req.url;
//     next();
// });

cloudinary.config({
  cloud_name: "saemarora",
  api_key: "811255976848432",
  api_secret: "CoB1cMxfKj59FjfqiBPeGqll0q4",
});

mongoose
  .connect(process.env.MONGODB_LINK, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((data) => console.log("database connected succesfully👍"))
  .catch((err) => console.error(err));
app.use("/Api/User", require("./Routes/User.js"));
app.use("/Api", require("./Routes/Login_Register"));
app.use("/Api/Projects", require("./Routes/Projects"));

app.use("/message", messageRoutes);

const server = app.listen(4000, () =>
  console.log("SUCESSFULLY RUNNING ON PORT")
);

const io = new Server(server, {
  cors: {
    origin:"http://localhost:3000",
    // origin:"https://project-dekho.vercel.app",
    Credential: true,
  },
});

let idtoemailmap = new Map();
let emailtoidmap = new Map();

io.on("connection", (socket) => {
  console.log("Socket Connected: ", socket.id);

  socket.on("userjoin", (email) => {
    idtoemailmap.set(socket.id, email);
    emailtoidmap.set(email, socket.id);
    console.log("Socket connected", socket.id, email);
  });

  socket.on("send_chat", ({ from, to, message, time }) => {
    const senderid = emailtoidmap.get(to);
    console.log(socket.id, " send chat to ", senderid, " : ", message);
    io.to(senderid).emit("recieve_chat", { from, message, time });
  });

  socket.on("like", ({ from, to }) => {
    const senderid = emailtoidmap.get(to);
    console.log(`${from} liked ${to} project`);
    io.to(senderid).emit("recieve_like", { from });
  });
  
});
