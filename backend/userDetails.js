const mongoose = require("mongoose");
const UserDetailsSchema = new mongoose.Schema(
    {

        fname: String,
        lname: String,
        email: { type:String, unique: true },
        password: String,
        follower:{
            type:Array,
            default:[],
        },
        following:{
            type:Array,
            default:[],
        },

        playlists: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PlaylistInfo',
          }],
    },
    {
        collection: "UserInfo",
    }
);

mongoose.model("UserInfo", UserDetailsSchema);