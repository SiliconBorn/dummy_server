const bcrypt = require("bcrypt");
const fs = require("node:fs").promises;
const path = require("node:path");
const users = require("../users.json");

const register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, password } = req?.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "REQUEST BODY REQUIRE BOTH USERNAME AND PASSWORD",
      });
    }

    const buf = Buffer.from(password.toString(), "base64");
    const hashedPassword = bcrypt.hashSync(buf.toString(), 10);

    const userDetails = {
      username,
      password: hashedPassword,
    };

    const alreadyExist =
      users.length > 0 && users.find((user) => user.username === username);
    console.group(alreadyExist);

    if (alreadyExist) {
      return res.status(409).json({
        message: "THE USERNAME ALREADY TAKEN",
      });
    }

    users.push(userDetails);

    await fs.writeFile(
      path.join(__dirname, "..", "users.json"),
      JSON.stringify(users)
    );

    return res.status(200).json({
      message: "REGISTERED SUCCESSFULLY",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    console.log(req, body);
    const { username, oldPassword, newPassword } = req?.body;

    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "OLD AND NEW PASSWORD CANT BE THE SAME",
      });
    }
    const userExist =
      users.length > 0 && users.find((user) => user.username === username);
    if (!userExist) {
      return res.status(400).json({
        message: "USER DOES NOT EXIST",
      });
    }

    const oldPasswordBuf = Buffer.from(oldPassword, "base64").toString();

    const isOldPasswordValid = bcrypt.compareSync(
      oldPasswordBuf,
      userExist.password
    );

    if (!isOldPasswordValid) {
      return res.status(401).json({
        message: "OLD PASSWORD IS INVALID FOR REQUESTED USER",
      });
    }
    const newPasswordBuf = Buffer.from(newPassword, "base64").toString();
    const newHashedPassword = bcrypt.hashSync(newPasswordBuf, 10);
    const newUserDetails = {
      username,
      newHashedPassword,
    };
    const updatedUsers = users.map((user) =>
      user.username === username ? newUserDetails : user
    );

    await fs.writeFile(
      path.join(__dirname, "..", "users.json"),
      JSON.stringify(updatedUsers)
    );

    return res.status(200).json({
      message: "PASSWORD CHANGED SUCCESSFULLY",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
    });
  }
};
module.exports = {
  register,
  changePassword,
};
