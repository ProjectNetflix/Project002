const mongoose = require("mongoose");
const PlaylistsSchema = new mongoose.Schema(
    {
        
        title: String,
        desc: String,
        movie:{
            type:Array,
            default:[],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserInfo',       
          },
        
    },
    {
        collection: "PlaylistInfo",
    }
);

mongoose.model("PlaylistInfo", PlaylistsSchema);