const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
    {

        content: String,
        movie: {
            type: Array,
            default: [],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserInfo',
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
    },
    {
        collection: "PostInfo",
    }
);

mongoose.model("PostInfo", PostSchema);