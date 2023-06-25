const mongoose = require("mongoose");
const PlaylistsSchema = new mongoose.Schema(
    {

        title: String,
        desc: String,
        imageUrl: {
            type: String,
            //required: true,
        },
        movie: {
            type: Array,
            default: [],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserInfo',
        },

        originalOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserInfo',
        },

    },
    {
        collection: "PlaylistInfo",
    }
);

mongoose.model("PlaylistInfo", PlaylistsSchema);