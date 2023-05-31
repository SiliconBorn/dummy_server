const express = require ("express")
const { register,changePassword } = require("../controller/register")

const registerRouter = express.Router()



registerRouter.post("/",register)
registerRouter.post("/changePassword",changePassword)




module.exports= registerRouter