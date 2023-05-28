const bcrypt = require("bcrypt");
const fs = require("node:fs").promises;
const path = require("node:path")
const users = require("../users.json")

const register = async(req,res)=>{

    try {
        console.log(req)
        const {username,password}= req?.body;
        if(!username || !password){
            return res.status(400).json({
                message:"REQUEST BODY REQUIRE BOTH USERNAME AND PASSWORD"
            })
        }

        const buf = Buffer.from(password,'base64');
        const hashedPassword = bcrypt.hashSync(buf.toString(),10);

        const userDetails = {
            username,
            password:hashedPassword
        };

        const alreadyExist = users.length>0 && users.find((user)=>user.username.toLowercase()===username.toLowercase());

        if(alreadyExist){
            return res.status(409).json({
            message:"THE USERNAME ALREADY TAKEN"
            })
        }

        users.push(userDetails);

        const result = await fs.writeFile(path.join(__dirname,"..","users.json"),users)

        if(result){

            return res.status(200).json({
                message:"Registered successsfully"
            })
        }


    } catch (error) {
        console.log(error)
        return error
    }
}


module.exports = {
    register
}