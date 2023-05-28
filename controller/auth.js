const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const fs = require("node:fs").promises;
const path = require("node:path")
const users = require("../users.json")
const {TOKEN_SECRET} = require("../serverConfig")

const login =(req,res)=>{

    try {
        const {username,password}= req?.body;

        if(!username || !password){
            return res.status(400).json({
                message:"BOTH USERNAME AND PASSWORD ARE REQUIRED"
            })
        }
        
        
        const alreadyExist = users.length > 0 && users.find((user)=>user.username===username);
        console.group(alreadyExist)
        
        if(!alreadyExist.username){
            return res.status(400).json({
                message:"THE USER DOESN'T EXIST. PLEASE REGISTER FIRST"
            })
        }
        
        const bufPassword = Buffer.from(password,"base64").toString();

        const passwordValid = bcrypt.compareSync(bufPassword,alreadyExist.password);

        if(!passwordValid){
            return res.status(401).json({
                message:"INVALID PASSWORD FOR REQUESTED USER"
            })
        }
        const expiresIn = 3600
        const token = jwt.sign({
            user:username,
            password:bufPassword
        },
         TOKEN_SECRET,
         {
            expiresIn
         }
        )
        console.log(token);

        return res.status(200).json({
            data:{
                access_token: token
            },
            message:"USER AUTHENTICATED"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error
        })
    }
}

const authenticateUser = (req,res,next)=>{
    try {
    console.log("authenticateUser")
        if (
            req.path==="/auth/login" ||
            req.path==="/register"
          ) {
            next();
        }else{
          
            const requestToken= req?.headers?.authorization;
            
            if(!requestToken){
          return res.status(401).json({
            auth:false,
            message:"NO TOKEN PROVIDED"
          })

        }
        console.log(`token:${requestToken}`)
        const token = requestToken.substring(7);

        jwt.verify(token,TOKEN_SECRET,(err,decoded)=>{

            if(err) {
                return res.status(401).json({
                    auth:false,
                    messsage:"FAILED TO AUTHENTICATE TOKEN"
                })
            }


            req.username = decoded?.username
            console.log(decoded)
            next()
        })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error
        })
    }
}


module.exports={
    login,
    authenticateUser
}