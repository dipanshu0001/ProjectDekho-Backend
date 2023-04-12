const UserModel=require('../Model/UserModel')
const {hash ,compare}=require('bcryptjs');
const{generateAcessToken,generateRefreshToken,sendAcessToken,sendRefreshToken}=require('./Tokens_Func')

const Register=async(req,res)=>{
    const{Username,Gmail,Password}=req.body
    // console.log(req.body);
    try{

        if(!Username || !Gmail || !Password){
            throw new Error("Fill all Fileds")
        }
        const result=await UserModel.findOne({Gmail:Gmail})
        if(result){
            throw new Error("User already exists")
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
        res.status(200).json("Registerted successfully")
    }catch(e){
        res.status(500).json({error:e.message})
    }

}
const Login=async(req,res)=>{
    const{Gmail,Password}=req.body;
    console.log(req.body);
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

        const update_data=await UserModel.findOneAndUpdate({Gmail},{Refreshtoken:refreshToken},{new:true});
        sendRefreshToken(req,res,refreshToken);
        sendAcessToken(req,res,accessToken);
    }catch(err){
        return res.status(500).json({error:err.message});
    }

}
const RefreshToken=async(req,res)=>{
    try{
        console.log(req.cookies)
            const token=req.cookies.refreshToken
        console.log(token);
        if(!token){
            const error =new Error("Session has expired token not their")
            error.accesstoken=""
            throw error
        }
        let payload=null;
        try{
            payload=verify(token,process.env.REFRESHTOKEN_SECERET);
        }
        catch(e){
            const error =new Error("Session has expired")
            error.accesstoken=""
            throw error
        }
        console.log(payload)
        const user= await UserModel.findOne({Uid:payload.uid});
        if(!user){
            const error =new Error("Session has expired")
            error.accesstoken=""
            throw error
        }
        console.log(user.refreshtoken)
        if(user.refreshtoken!==token){
            const error =new Error("Session has expired")
            error.accesstoken=""
            throw error
        }
        const accessToken=generateAcessToken(user.Uid);
        const refreshToken=generateRefreshToken(user.Uid);

        const update_data=await UserModel.findOneAndUpdate({Gmail:user.Gmail},{Refreshtoken:refreshToken},{new:true});
        sendRefreshToken(req,res,refreshToken);
        sendAcessToken(req,res,accessToken);
    }catch(err){
        console.log(err.message)
        res.status(500).json({error:err.message});
    }
}


module.exports={
     Register,
     Login,
     RefreshToken
}