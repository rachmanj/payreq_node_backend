const User = require("../models/User");
const bcrypt = require("bcrypt");

// @desc    Get all users
// @route   GET /users
// @access  Private
const getAllUsers = async (req, res) => {
  // Get all users from the database
  const users = await User.find().select("-password").lean();

  // if no users found, return 400
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
};

// @desc   Create a new user
// @route  POST /users
// @access Private
const createUser = async (req, res) => {
  const { name, username, password, project, roles } = req.body;

  // confirm data
  if (!name || !username || !password || !project) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  // check for duplicate username
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res
      .status(400)
      .json({ message: `Username ${username} already exist` });
  }

  // hash password
  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { name, username, password: hashedPwd, project }
      : { name, username, password: hashedPwd, project, roles };

  // create new user
  const user = await User.create(userObject);

  // respon
  if (user) {
    res.status(201).json({ message: `User ${user.name} created` });
  } else {
    res.status(400).json({ message: "Error creating user" });
  }
};

// @desc   Update a user
// @route  PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, name, username, password, project, roles, active } = req.body;

  // confirm data
  if (
    !id ||
    !name ||
    !username ||
    !project ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  // does the user exist?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // check for duplicate username
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Username already exists" });
  }

  user.name = name;
  user.username = username;
  user.roles = roles;
  user.project = project;
  user.active = active;

  // hash password
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  // update user
  const updatedUser = await user.save();

  res.json({ message: `User ${updatedUser.name} updated` });
};

// @desc   Delete a user
// @route  DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body;

  //confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // does the user exist?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `User ${user.name} with ID ${user._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
