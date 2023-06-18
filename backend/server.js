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
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const { userInfo } = require("os");
const checkAuthorization = require("./checkAuthorization");

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";
const mongoUrl = "mongodb+srv://Maprang6224:3gfksnMxGlIVQ6uq@project-workshop.isbh5gk.mongodb.net/?retryWrites=true&w=majority"


mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));


require("./User");
require("./Playlist");
require("./Movie");


// กำหนดตำแหน่งเก็บไฟล์ให้ multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  }
});
// ตรวจสอบประเภทไฟล์ที่อัปโหลดเฉพาะ .jpg, .jpeg, และ .png
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|JPG|JPEG)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// สร้าง middleware สำหรับการอัปโหลดไฟล์
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});


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
      imageUrl: "",
      fname,
      lname,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" + error });
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

app.get('/userData/:id', async (req, res) => {
  try {
    const user = await UserInfo.findById(req.params.id);
    res.send({ status: 'ok', data: user });
  } catch (error) {
    res.send({ status: 'error', data: error });
  }
});

app.get("/allusers", async (req, res) => {
  try {
    const allUser = (await UserInfo.find({}));
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

app.put('/updateUser/:id', upload.single('image'), async (req, res) => {
  const { fname, lname } = req.body;
  const imageURL = req.file ? req.file.path.replace(/\\/g, '/') : null;

  try {
    const user = await UserInfo.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบเพลย์ลิสต์' });
    }
    user.imageUrl = imageURL || user.imageUrl;
    user.fname = fname || user.fname;
    user.lname = lname || user.lname;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ข้อผิดพลาดของเซิร์ฟเวอร์' });
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
        //res.send({ status: 'error', data: "Movie already exists in the playlist" });
        res.status(403).json("คุณไม่ได้ติดตาม");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("คุณไม่สามารถยกเลิกการติดตามตัวคุณเอง");
  }
});

app.post('/search-users', (req, res) => {
  let userPattern = new RegExp("^" + req.body.query)
  UserInfo.find({ fname: { $regex: userPattern } })
    .select("_id fname")
    .then(user => {
      res.json({ user })
    }).catch(err => {
      console.log(err)
    })

})

//---------
require("./Playlist");
const PlaylistInfo = mongoose.model("PlaylistInfo")

app.get('/playlists', async (req, res) => {
  try {
    const playlists = await PlaylistInfo.find().populate('user', 'fname');
    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

//POST /api/playlists สร้าง playlist 
app.post('/createPlaylist', upload.single('image'), async (req, res) => {
  const { userId, title, desc, movie } = req.body;
  //const imageURL = req.file.path.replace(/\\/g, '/')
  const imageURL = req.file ? req.file.path.replace(/\\/g, '/') : null;

  // if (!!imageURL) {
  //   const imageURL = req.file.path.replace(/\\/g, '/')
  //   console.log(req.file);
  // };

  try {
    const user = await UserInfo.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const playlist = new PlaylistInfo({
      title,
      desc,
      movie,
      user: user._id,
      imageUrl: imageURL  // เพิ่มส่วนนี้เพื่อเก็บที่อยู่ของรูปภาพ
    });

    await playlist.save();

    // Add the playlist ID to the user's playlists array
    //user.playlists.push(playlist._id);
    await user.save();

    res.status(200).json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


app.get('/playlists-user/:id', async (req, res) => {
  try {
    const playlists = await PlaylistInfo.find({ user: req.params.id }).populate('user');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/playlists/:id อัปเดต playlist ที่ถูกสร้างแล้ว
app.put('/updatePlaylist/:id', upload.single('image'), async (req, res) => {
  const { title, desc, movie } = req.body;
  const imageURL = req.file ? req.file.path.replace(/\\/g, '/') : null;

  try {
    const playlist = await PlaylistInfo.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'ไม่พบเพลย์ลิสต์' });
    }

    playlist.title = title || playlist.title;
    playlist.desc = desc || playlist.desc;
    playlist.movie = movie || playlist.movie;
    playlist.imageUrl = imageURL || playlist.imageUrl;

    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ข้อผิดพลาดของเซิร์ฟเวอร์' });
  }
});

// ============ get by id ===========
app.get("/playlists/:id", async (req, res) => {
  try {
    const playlistId = req.params.id;

    // ค้นหาเพลย์ลิสต์ด้วย ID
    const playlist = await PlaylistInfo.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ error: "ไม่พบเพลย์ลิสต์" });
    }

    // await PlaylistInfo.deleteOne({ _id: playlistId });
    res.status(200).json(playlist);
    //res.json({ message: "ลบเพลย์ลิสต์เรียบร้อยแล้ว" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});

app.delete("/playlists/:id", async (req, res) => {
  try {
    const playlistId = req.params.id;

    // ค้นหาเพลย์ลิสต์ด้วย ID
    const playlist = await PlaylistInfo.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ error: "ไม่พบเพลย์ลิสต์" });
    }

    // ลบเพลย์ลิสต์
    await PlaylistInfo.deleteOne({ _id: playlistId });

    res.json({ message: "ลบเพลย์ลิสต์เรียบร้อยแล้ว" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});

const movieInfo = mongoose.model("movieIn")

app.get("/movie/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await movieInfo.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: "ไม่พบข้อมูล" });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});

app.post("/movies", async (req, res) => {
  const { name, synopsis, pic, title_type, netflix_id, title_date, year } = req.body;
  console.log(req.body);
  try {
    const movie = await movieInfo.create({ name, synopsis, pic, title_type, netflix_id, title_date, year });
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: "Failed to create movie" });
  }
});

app.get('/movies', async (req, res) => {
  try {
    const movies = await movieInfo.find().populate('name');
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

//เพิ่ม Movie ลงใน playlist
app.put("/addMovieToPlaylist/:playlistId", async (req, res) => {

  try {
    const playlistId = req.params.playlistId;
    const movieId = req.body.movieId;
    const playlist = await PlaylistInfo.findById(playlistId);    // ค้นหา Playlist ด้วย ID

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // ตรวจสอบว่าหนังอยู่ในเพลย์ลิสต์แล้วหรือไม่
    const movieIndex = playlist.movie.findIndex((m) => m._id.toString() === movieId);
    if (movieIndex !== -1) {
      return res.send({ status: 'error', data: "Movie already exists in the playlist" });
      //return res.status(400).json({ message: "Movie already exists in the playlist" });
    }

    const movie = await movieInfo.findById(movieId);    // ค้นหาหนังด้วย ID
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // เพิ่มหนังเข้าใน Playlist
    playlist.movie.push(movie);
    await playlist.save();
    res.status(200).json(playlist);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ลบหนังออกจาก Playlist
app.put("/removeMovieFromPlaylist/:playlistId", async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const movieId = req.body.movieId;
    const playlist = await PlaylistInfo.findById(playlistId);    // ค้นหา Playlist ด้วย ID
    console.lod(movieId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const movie = await movieInfo.findById(movieId);    // ค้นหาหนังด้วย ID
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    playlist.movie = playlist.movie.filter((m) => m._id.toString() !== movieId);    // ลบหนังออกจาก Playlist
    await playlist.save();
    res.status(200).json(playlist);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

require("./Favlist");
const FavListInfo = mongoose.model("FavList")

app.post("/addtofavlist", async (req, res) => {
  const { userId, movieId } = req.body;
  try {
    const user = await UserInfo.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    const movie = await movieInfo.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "ไม่พบหนัง" });
    }

    const existingFav = await FavListInfo.findOne({ user: user._id, movie: movie._id });
    if (existingFav) {
      return res.status(400).json({ message: "หนังนี้ถูกใจอยู่แล้ว" });
    }

    const favList = new FavListInfo({
      user: user._id,
      movie: movie._id
    });

    await favList.save();
    res.status(200).json(favList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ข้อผิดพลาดของเซิร์ฟเวอร์" });
  }
});

app.get("/favlist/:userId", checkAuthorization ,async (req, res) => {
  try {
    const userId = req.params.userId;
    const favList = await FavListInfo.find({ user: userId }).populate("movie");
    res.status(200).json(favList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ข้อผิดพลาดของเซิร์ฟเวอร์" });
  }
});

app.delete("/removefromfavlist", async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    const user = await UserInfo.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    const movie = await movieInfo.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "ไม่พบหนัง" });
    }

    const existingFav = await FavListInfo.findOne({ user: user._id, movie: movie._id });
    if (!existingFav) {
      return res.status(400).json({ message: "หนังนี้ไม่ได้ถูกใจ" });
    }

    await FavListInfo.findByIdAndRemove(existingFav._id);
    res.status(200).json({ message: "ลบหนังออกจากการถูกใจสำเร็จ" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ข้อผิดพลาดของเซิร์ฟเวอร์" });
  }
});

app.listen(5000, () => {
  console.log("Server Started");
});

