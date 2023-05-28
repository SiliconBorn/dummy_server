const express = require("express");
const { getAllUsers } = require("../controller/users");

const userRouter = express.Router();



userRouter.get("/",getAllUsers);


module.exports = userRouter;

