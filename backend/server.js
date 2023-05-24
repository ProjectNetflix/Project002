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

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));


require("./userDetails");

const UserInfo = mongoose.model("UserInfo");
app.post("/signup", async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    // const oldUser = await UserInfo.findOne({ username });
    const oldEmail = await UserInfo.findOne({ email });

    if (oldEmail) {
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserInfo.findOne({ email });
  if (!user) {
    return res.json({ status: "ไม่พบผู้ใช้" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email, userId: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token, userId: user._id });
    } else {
      return res.json({ status: "error" });
    }
  }
  res.json({ status: "รหัสผ่านไม่ถูกต้อง" });
});


app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const email = user.email;
    UserInfo.findOne({ email: email })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) { }
});

app.get("/allusers", async (req, res) => {
  try {
    const allUser = (await UserInfo.find({}));
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

app.get("/find/:id", async (req, res) => {
  try {
    const user = await UserInfo.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/friends/:userId", async (req, res) => {
  try {
    const user = await UserInfo.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return UserInfo.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, fname, profilePicture } = friend;
      friendList.push({ _id, fname, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});

//-----follow & unfollow---------------
app.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await UserInfo.findById(req.params.id);
      const currentUser = await UserInfo.findById(req.body.userId);
      if (!user.follower.includes(req.body.userId)) {
        await user.updateOne({ $push: { follower: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("กำลังติดตาม");
      } else {
        res.status(403).json("ติดตามอยู่แล้ว");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("ติดตามตัวเองไม่ได้");
  }
});

app.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await UserInfo.findById(req.params.id);
        const currentUser = await UserInfo.findById(req.body.userId);
        if (user.follower.includes(req.body.userId)) {
          await user.updateOne({ $pull: { follower: req.body.userId } });
          await currentUser.updateOne({ $pull: { following: req.params.id } });
          res.status(200).json("เลิกติดตามแล้ว");
        } else {
          res.status(403).json("คุณไม่ได้ติดตาม");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("คุณไม่สามารถยกเลิกการติดตามตัวคุณเอง");
    }
  });

app.listen(5000, () => {
  console.log("Server Started");
});