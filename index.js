const express = require("express");
const bodyParser = require("body-parser");
const registerRouter = require("./routes/register");

const app = express();
const { PORT } = require("./serverConfig");
const authRouter = require("./routes/auth");
const { authenticateUser } = require("./controller/auth");
const userRouter = require("./routes/users");

const SERVER = () => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(bodyParser.json())

  app.use(
      authenticateUser
    
  );

  app.use("/register", registerRouter);
  app.use("/auth", authRouter);
  app.use("/project/users", userRouter);

  app.listen(PORT, () => {
    console.log(`SERVER STARTED ON PORT ${PORT}`);
  });
};

SERVER();
