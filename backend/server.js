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
      return res.json({ status: "Email already in use" });
    }

    if (password.length < 8) {
      return res.json({ status: "Please enter password correctly." });
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
    return res.json({ status: "User not found" });
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
  res.json({ status: "Incorrect password" });
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

  } catch (error) {
    res.send({ status: "error", data: error });
  }
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
      return res.status(404).json({ message: 'Playlist not found' });
    }
    user.imageUrl = imageURL || user.imageUrl;
    user.fname = fname || user.fname;
    user.lname = lname || user.lname;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
        res.status(200).json("Is following");
      } else {
        res.status(403).json("Already followed");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Server error");
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
        res.status(200).json("Unfollow");

      } else {
        //res.send({ status: 'error', data: "Movie already exists in the playlist" });
        res.status(403).json("You don't follow");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Server error");
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
    const playlists = await PlaylistInfo.find().populate('owner', 'fname');
    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

//POST /api/playlists สร้าง playlist 
app.post('/createPlaylist', upload.single('image'), async (req, res) => {
  const { userId, title, desc, movie } = req.body;
  const imageURL = req.file ? req.file.path.replace(/\\/g, '/') : null;

  try {
    const user = await UserInfo.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const playlist = new PlaylistInfo({
      title,
      desc,
      movie,
      owner: user._id,
      imageUrl: imageURL,
      originalOwner: null, // ให้ค่าเริ่มต้นของ originalOwner เป็น null เมื่อสร้าง playlist ด้วย createPlaylist
    });

    await playlist.save();
    await user.save();

    res.status(200).json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/playlists-user/:id', async (req, res) => {
  try {
    const playlists = await PlaylistInfo.find({ owner: req.params.id }).populate('owner');
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
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.title = title || playlist.title;
    playlist.desc = desc || playlist.desc;
    playlist.movie = movie || playlist.movie;
    playlist.imageUrl = imageURL || playlist.imageUrl;

    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ get by id ===========
app.get("/playlists/:id", async (req, res) => {
  try {
    // const originalOwner = await UserInfo.findById(userId);
    const playlistId = req.params.id;

    // ค้นหาเพลย์ลิสต์ด้วย ID
    const playlist = await PlaylistInfo.findById(playlistId).populate('originalOwner');

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // await PlaylistInfo.deleteOne({ _id: playlistId });
    res.status(200).json(playlist);
    //res.json({ message: "ลบเพลย์ลิสต์เรียบร้อยแล้ว" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/playlists/:id", async (req, res) => {
  try {
    const playlistId = req.params.id;

    // ค้นหาเพลย์ลิสต์ด้วย ID
    const playlist = await PlaylistInfo.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // ลบเพลย์ลิสต์
    await PlaylistInfo.deleteOne({ _id: playlistId });

    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


const movieInfo = mongoose.model("movieIn")

app.get("/movie/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await movieInfo.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
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
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: "Server error" });
  }
});

// ลบหนังออกจาก Playlist
app.put("/removeMovieFromPlaylist/:playlistId", async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const movieId = req.body.movieId;
    const playlist = await PlaylistInfo.findById(playlistId);    // ค้นหา Playlist ด้วย ID
    console.log(movieId);
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
    res.status(500).json({ message: "Server error" });
  }
});

// copy playlist ของ user อื่น
app.post('/copyPlaylist/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { userId, ownerplId } = req.body;

    const currentUser = await UserInfo.findById(userId);
    const checkAuthorization = currentUser.following.includes(ownerplId);

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const playlistToCopy = await PlaylistInfo.findById(playlistId);
    if (!playlistToCopy) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (checkAuthorization) {
      const newPlaylist = new PlaylistInfo({
        title: playlistToCopy.title,
        desc: playlistToCopy.desc,
        imageUrl: playlistToCopy.imageUrl,
        movie: playlistToCopy.movie,
        owner: currentUser._id,
        originalOwner: playlistToCopy.originalOwner || playlistToCopy.owner, // เก็บค่า originalOwner ของ playlist ที่ถูกคัดลอก ถ้าไม่มีค่าในฟิลด์ originalOwner ให้ใช้ค่า owner แทน
      });

      await newPlaylist.save();
      res.json({
        status: 'ok',
        message: 'Playlist copied',
        originalOwner: newPlaylist.originalOwner,
      });
    } else {
      res.json({ status: 'error', message: "You don't have permission to access" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// post
require("./Post");
const PostInfo = mongoose.model('PostInfo');

app.post("/createPost", async (req, res) => {
  console.log(req.body);
  try {
    const { content, score } = req.body;
    const { movieId } = req.body;
    const { userId } = req.body;
    const movie = await movieInfo.findById(movieId);
    const owner = await UserInfo.findById(userId);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const post = new PostInfo({
      content,
      owner,
      movie,
      score,
    });

    const savedPost = await post.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Cannot create posts" });
  }
});

app.delete("/deletePost/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    // ตรวจสอบว่าโพสต์มีอยู่หรือไม่
    const post = await PostInfo.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // ตรวจสอบสิทธิ์การลบโพสต์
    // if (req.user.id !== post.owner.toString()) {
    //   return res.status(403).json({ error: "ไม่ได้รับอนุญาตให้ลบโพสต์" });
    // }

    // ลบโพสต์
    await post.deleteOne({ _id: postId });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Cannot delete posts" });
  }
});

app.put("/editPost/:postId", async (req, res) => {
  try {
    const { content, score } = req.body;
    const { postId } = req.params;

    const updatedPost = await PostInfo.findByIdAndUpdate(
      postId,
      { content, score },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Cannot update posts" });
  }
});

//--- get ด้วย id 
app.get("/posts/:postid", async (req, res) => {
  try {
    const postId = req.params.postid;

    // ค้นหาโพสต์ด้วย ID
    const post = await PostInfo.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/postsmovie/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await movieInfo.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const posts = await PostInfo.find({ movie: movieId }).populate('owner').populate("movie");
    res.json(posts);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ get ว่า user คนนี้ มี post อะไรบ้าง===========
app.get("/userPosts/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // ค้นหาผู้ใช้งานด้วย ID
    const user = await UserInfo.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ค้นหาโพสต์ที่เกี่ยวข้องกับผู้ใช้งาน
    const posts = await PostInfo.find({ owner: userId }).populate('owner').populate("movie");

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/allpost', async (req, res) => {
  try {
    const post = await PostInfo.find().populate('owner').populate('movie');
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/allpost/following/:userid', async (req, res) => {
  try {
    const currentUser = await UserInfo.findById(req.params.userid);
    const userIds = currentUser.following; // หรือ req.params.userIds หากคุณต้องการใช้พารามิเตอร์จาก URL
    const posts = await PostInfo.find({ owner: { $in: userIds } || { currentUser } }).populate('owner').populate('movie');
    const postuser = await PostInfo.find({ owner: currentUser }).populate('owner').populate('movie');
    posts.push(...postuser)
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put("/posts/:postId/like", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    // Find the post by postId
    const post = await PostInfo.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // User has already liked the post, so unlike it
      post.likes = post.likes.filter((like) => like.toString() !== userId);
    } else {
      // User has not liked the post, so like it
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
      }
    }

    // Save the updated post
    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/users/:userId/movies/:movieId/like", async (req, res) => {
  try {
    const userId = req.params.userId;
    const movieId = req.params.movieId;
    //const action = req.body.action; // 'like' หรือ 'unlike'

    // ตรวจสอบว่าผู้ใช้และเรื่องหนังที่ต้องการกด like/unlike มีอยู่ในระบบหรือไม่
    const user = await UserInfo.findById(userId);
    const movie = await movieInfo.findById(movieId);
    if (!user || !movie) {
      return res.status(404).json({ message: "User or movie not found" });
    }

    // ตรวจสอบว่าผู้ใช้ได้กด like หรือ unlike รายการนี้แล้วหรือยัง
    const likedMovies = user.likesMovies;
    const isLiked = likedMovies.includes(movieId);

    if (!isLiked) {
      // ถ้ายังไม่ได้กด like รายการนี้ ให้เพิ่ม ObjectID ของรายการเรื่องนี้ลงในฟิลด์ "likesMovies" ของผู้ใช้
      user.likesMovies.push(movieId);
      await user.save();
      return res.status(200).json({ message: "Movie liked successfully" });
    } else {
      return res.status(400).json({ message: "Movie is already liked" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/users/:userId/movies/:movieId/unlike", async (req, res) => {
  try {
    const userId = req.params.userId;
    const movieId = req.params.movieId;
    //const action = req.body.action; // 'like' หรือ 'unlike'

    // ตรวจสอบว่าผู้ใช้และเรื่องหนังที่ต้องการกด like/unlike มีอยู่ในระบบหรือไม่
    const user = await UserInfo.findById(userId);
    const movie = await movieInfo.findById(movieId);

    if (!user || !movie) {
      return res.status(404).json({ message: "User or movie not found" });
    }

    // ตรวจสอบว่าผู้ใช้ได้กด like หรือ unlike รายการนี้แล้วหรือยัง
    const likedMovies = user.likesMovies;
    const isLiked = likedMovies.includes(movieId);
    if (isLiked) {
      // ถ้าผู้ใช้ได้กด like รายการนี้แล้ว ให้ลบ ObjectID ของรายการเรื่องนี้ออกจากฟิลด์ "likesMovies" ของผู้ใช้
      user.likesMovies = likedMovies.filter((movie) => movie.toString() !== movieId);
      await user.save();
      return res.status(200).json({ message: "Movie unliked successfully" });
    } else {
      return res.status(400).json({ message: "Movie is not liked" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(5000, () => {
  console.log("Server Started");
});

