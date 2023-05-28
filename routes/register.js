const express = require("express")
const { register } = require("../controller/register")

const registerRouter = express.Router()



registerRouter.post("/",register)




module.exports= registerRouter