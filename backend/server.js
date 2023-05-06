const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
const multer = require('multer');

const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";
const mongoUrl = "mongodb+srv://Maprang6224:3gfksnMxGlIVQ6uq@project-workshop.isbh5gk.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongoUrl,{
    useNewUrlParser: true,
})
.then(() => {
    console.log("Connected to database");
})
.catch((e) => console.log(e));


require("./userDetails");

const UserInfo = mongoose.model("UserInfo");
app.post("/signup", async(req,res) => {
    const { fname, lname, email, password } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        // const oldUser = await UserInfo.findOne({ username });
        const oldEmail = await UserInfo.findOne({ email });

        if(oldEmail){
          return res.json({ status: "อีเมลล์นี้ถูกใช้แล้ว" });
       }
      

      if (password.length < 8) {
        return res.json({ status: "กรุณากรอก Password ให้ถูกต้อง" });
      }
       
        await UserInfo.create({
            fname,
            lname,
            email,
            password: encryptedPassword,
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error" });
    }
});

app.listen(5000, ()=> {
    console.log("Server Started");
});