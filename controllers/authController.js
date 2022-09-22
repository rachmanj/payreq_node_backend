const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc    Login
// @route   POST /auth
// @access  Public
const login = async (req, res) => {
  const { username, password } = req.body;

  // confirm data
  if (!username || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  // check if user exists
  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // compare password
  const isMatch = await bcrypt.compare(password, foundUser.password);

  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  // create access token
  const accessToken = jwt.sign(
    {
      userInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  // create refresh token
  const refreshToken = jwt.sign(
    {
      username: foundUser.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // create secure cookie with refresh token
  res.cookie("payreqToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  // respon
  res.json({ accessToken });
};

// @desc   Refresh Token
// @route  POST /auth/refresh
// @access Public - becase we need to send the refresh token
const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.payreqToken)
    return res.status(401).json({ message: "No cookie token" });

  const refreshToken = cookies.payreqToken;

  // verify refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      // create access token
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      // respon
      res.json({ accessToken });
    }
  );
};

// @desc   Logout
// @route  POST /auth/logout
// @access Public - just to clear the cookie
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.payreqToken) return res.sendStatus(204); // no content
  res.clearCookie("payreqToken", {
    httpOnly: true,
    secure: false,
    sameSite: "None",
  });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
