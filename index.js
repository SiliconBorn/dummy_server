const express = require("express");
const  dotenv = require("dotenv");
const bodyParser = require("body-parser")
const registerRouter = require("./routes/register");
dotenv.config();

const app = express();
const PORT = process.env.PORT


const SERVER = () =>{
    app.use(bodyParser.urlencoded({extended:true}))
    app.use('/register',registerRouter)

    app.listen(PORT,()=>{
        console.log(`SERVER STARTED ON PORT ${PORT}`);
    })
}

SERVER()