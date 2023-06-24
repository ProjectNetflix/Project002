const mongoose = require("mongoose");
const UserDetailsSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
        },
        fname: String,
        lname: String,
        email: { type: String, unique: true },
        password: String,
        follower: {
            type: Array,
            default: [],
        },
        following: {
            type: Array,
            default: [],
        }, 

        likesMovies: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'movieIn',
        }],
 
    },
    {
        collection: "UserInfo",
    }
);

mongoose.model("UserInfo", UserDetailsSchema);