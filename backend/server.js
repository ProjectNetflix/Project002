const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const loginRoute = require('./route/login')

const app = express()

//connet cloud database
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:false
})
.then(()=>console.log("Connected to MongoDB"))
.catch((err)=>console.log(err))

//middleware
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

//route
app.use('/api',loginRoute)
// app.get("*",(req,res)=>{
//     res.json({
//         data:"message from server"
//     })
// })

const port = process.env.PORT || 8080
app.listen(port,()=>console.log(`start server in port ${port}`))