require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { User } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    const { nick } = req.body;
    const findImage = await User.findOne({
      where: { id: req.user.id },
      attributes: ["profileImage"],
    });

    if (
      req.file &&
      findImage.profileImage &&
      findImage.profileImage.includes("uploads")
    ) {
      fs.unlink(
        path.join(__dirname, "../..", findImage.profileImage),
        (err) => {
          if (err) throw err;
        }
      );
    }
    await User.update(
      { nick, profileImage: req.file ? req.file.path : findImage.profileImage },
      { where: { id: req.user.id } }
    );
    const updateInfo = await User.findOne({ where: { id: req.user.id } });
    const token = jwt.sign(
      {
        id: updateInfo.id,
        nick: updateInfo.nick,
        emai: updateInfo.email,
        provider: updateInfo.provider,
        profileImage: updateInfo.profileImage,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).cookie("access_token", token).json({ access_token: token });
  } catch (err) {
    next(err);
  }
};
