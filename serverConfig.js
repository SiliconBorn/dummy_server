const  dotenv = require("dotenv");
dotenv.config();


module.exports = {
    PORT : process.env.PORT,
    TOKEN_SECRET: process.env.TOKEN_SECRET
}
