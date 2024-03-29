const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
    {

        content: String,
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'movieIn',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserInfo',
        },

        score: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'UserInfo',
            }
        ]

       
    },
    {
        collection: "PostInfo",
    }
);

mongoose.model("PostInfo", PostSchema);