const UserModel=require('../Model/UserModel')
const {hash ,compare}=require('bcryptjs');
const { verify } = require('jsonwebtoken');
const{generateAcessToken,generateRefreshToken,sendAcessToken,sendRefreshToken,}=require('./Tokens_Func')

const Register=async(req,res)=>{
    const{Username,Gmail,Password,ConfirmPassword}=req.body
    // console.log(req.body);
    if(!Username || !Gmail || !Password || !ConfirmPassword){
        return res.send({message:"Fill all Fields",type:2})

    }
    else if(Password!==ConfirmPassword){
        return res.send({message:"Confirm Password doesnt match",type:3})
    }
    try{
        const result=await UserModel.findOne({Gmail:Gmail})
        if(result){
            throw new Error("Email already exists")
        }
        const hashpassword=await hash(Password,10);
        // console.log(hashpassword)
        const new_user=new UserModel({
            Username:Username,
            Gmail:Gmail,
            Password:hashpassword,
        })
        const saved =new_user.save();
        // console.log("New user saved");
        res.status(200).json({message:`${Username} Registerted successfully`,type:1})
    }catch(e){
        res.status(500).json({error:e.message,type:2})
    }

}
const Login=async(req,res)=>{
    const{Gmail,Password}=req.body;
    // console.log(req.body);
    try{
        if(!Gmail||!Password){
            throw new Error ("Fill all Fields")
        }
        const user= await UserModel.findOne({Gmail});
        if(!user){
            throw new Error("User Does not exist")
        }
        const is_match=await compare(Password,user.Password);
        if(!is_match){
            throw new Error("Password does not match")
        }
        const accessToken=generateAcessToken(user.Uid);
        const refreshToken=generateRefreshToken(user.Uid);
console.log(user)
        const update_data=await UserModel.findOneAndUpdate({Gmail},{Refreshtoken:refreshToken},{new:true});
        sendRefreshToken(req,res,refreshToken);
        // sendAcessToken(req,res,accessToken);
        res.status(200).send({
            message:`${user.Username} Logged in successfully`,
            type:1 ,
            accesstoken:accessToken,
            user})
    }catch(err){
        return res.status(500).json({message:err.message,type:3});
    }

}
const RefreshToken=async(req,res)=>{
    try{
        // console.log(req.cookies,"Cookies")
            const token=req.cookies.refreshToken
        // console.log(token);
        if(!token){
            const error =new Error("Session has expired token not their")
            error.accesstoken=""
            throw error
        }
        let payload=null;
        try{
            payload=verify(token,process.env.REFRESHTOKEN_SECERET);
            // console.log(payload,"Payload")
        }
        catch(e){
            // console.log(e.message,"error")
            const error =new Error("Session has expired")
            error.accesstoken=""
            throw error
        }
        // console.log(payload)
        // console.log(payload,"payload")
        const user= await UserModel.findOne({Uid:payload.uid});
        if(!user){
            const error =new Error("Session has expired")
            error.accesstoken=""
            throw error
        }
        // console.log(user.Refreshtoken)
        if(user.Refreshtoken!==token){
            const error =new Error("Session has expired")
            error.accesstoken=""
            throw error
        }
        const accessToken=generateAcessToken(user.Uid);
        const refreshToken=generateRefreshToken(user.Uid);

        const update_data=await UserModel.findOneAndUpdate({Gmail:user.Gmail},{Refreshtoken:refreshToken},{new:true});
        sendRefreshToken(req,res,refreshToken);
        // console.log(accessToken,user,"Refresh ka smaan hai");
        res.status(200).send({accesstoken:accessToken,user})
        // sendAcessToken(req,res,accessToken);
    }catch(error){
        // console.log(error.message)
        res.status(500).json({error:error.message});
    }
}
const clear_cookie=(req,res)=>{
    res.clearCookie('refreshToken', { path: '/Api/RefreshToken' });
    res.send("clear cookie")
  }

  const GetUser=async(req,res)=>{
    try{
        const {Uid}=req.body
      const result=await UserModel.findOne({Uid});
      if(result)
      return res.send({details:result})
    }catch(err){
        res.send(err.message)
    }
  }

module.exports={
     Register,
     Login,
     RefreshToken,
     clear_cookie,
     GetUser
}