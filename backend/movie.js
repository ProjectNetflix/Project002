const mongoose = require("mongoose");
const MovieSchema = new mongoose.Schema(
    {

        name: String,
        synopsis: String,
        pic: {
            type: String,
            required: true,
        },

        title_type: String,
        netflix_id: {
            type: String,
            unique: true,
        },
        title_date: Date,
        year: String,

    },
    {
        collection: "movieIn",
    }
);

mongoose.model("movieIn", MovieSchema);
