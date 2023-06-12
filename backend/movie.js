const mongoose = require("mongoose");
const MovieSchema = new mongoose.Schema(
    {
        
        name: String,
        synopsis: String,
        pic: { 
            type:String,
            required: true,
        },      
        
    },
    {
        collection: "movieInfo",
    }
);

mongoose.model("movieInfo", MovieSchema);
