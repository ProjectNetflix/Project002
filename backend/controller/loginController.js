const jwt = require("jsonwebtoken")


exports.login=(req,res)=>{
    //ข้อมูล username , password
    const {email,password} = req.body
   
    if(password === process.env.PASSWORD ){
        const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'1d'})
        return res.json({token,email})
    }else{
        return res.status(400).json({error:"รหัสผ่านไม่ถูกต้อง"})
    }
}

