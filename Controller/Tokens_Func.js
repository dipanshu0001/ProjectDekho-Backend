
const{sign}=require("jsonwebtoken");
// const { RefreshToken } = require("./Login_Register_func");




const generateAcessToken = (uid)=>{
    console.log(process.env.ACESSTOKEN_SECERET)
    return sign({uid},process.env.ACESSTOKEN_SECERET,{expiresIn:"15m"})
}
const generateRefreshToken = (uid)=>{
    console.log(process.env.REFRESHTOKEN_SECERET)
    return sign({uid},process.env.REFRESHTOKEN_SECERET,{expiresIn:"7d"});
}

const sendAcessToken = (req,res,accesstoken)=>{
    res.status(200).send({
        accesstoken,
        message:"Logged in successfully"
    })
}
const sendRefreshToken=(req,res,refreshToken)=>{
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        path:"/refresh_token"
    })
}

module.exports = {generateAcessToken,generateRefreshToken,sendAcessToken,sendRefreshToken}