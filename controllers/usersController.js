const User = require("../models/User");
const Department = require("../models/Department");
const Project = require("../models/Project");
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

  // respon users with dept and project name
  const usersWithDeptAndProject = await Promise.all(
    users.map(async (user) => {
      const department = await Department.findById(user.department)
        .lean()
        .exec();
      const project = await Project.findById(user.project).lean().exec();
      return {
        ...user,
        department: department?.name,
        project: project.code,
      };
    })
  );

  res.json(usersWithDeptAndProject);
};

// @desc   Create a new user
// @route  POST /users
// @access Private
const createUser = async (req, res) => {
  const { fullname, username, password, projectId, roles, nik, departmentId } =
    req.body;

  // confirm data
  if (!fullname || !username || !password || !projectId) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  // check for duplicate username
  const duplicateUsername = await User.findOne({ username }).lean().exec();

  if (duplicateUsername) {
    return res
      .status(400)
      .json({ message: `Username ${username} already exist` });
  }

  // check for duplicate nik
  const duplicateNik = await User.findOne({ nik }).lean().exec();

  if (duplicateNik) {
    return res.status(400).json({ message: `NIK ${nik} already exist` });
  }

  // hash password
  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject =
    !Array.isArray(roles) || !roles.length
      ? {
          fullname,
          username,
          password: hashedPwd,
          projectId,
          nik,
          departmentId,
        }
      : {
          fullname,
          username,
          password: hashedPwd,
          projectId,
          nik,
          departmentId,
          roles,
        };

  // create new user
  const user = await User.create(userObject);

  // respon
  if (user) {
    res.status(201).json({ message: `User ${user.fullname} created` });
  } else {
    res.status(400).json({ message: "Error creating user" });
  }
};

// @desc   Update a user
// @route  PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const {
    id,
    fullname,
    username,
    password,
    projectId,
    roles,
    active,
    nik,
    departmentId,
  } = req.body;

  // confirm data
  if (
    !id ||
    !fullname ||
    !username ||
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
  const duplicateUsername = await User.findOne({ username }).lean().exec();

  if (duplicateUsername && duplicateUsername?._id.toString() !== id) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // check for duplicate nik
  const duplicateNik = await User.findOne({ nik }).lean().exec();

  if (duplicateNik && duplicateNik?._id.toString() !== id) {
    return res.status(409).json({ message: "NIK already exists" });
  }

  user.fullname = fullname;
  user.username = username;
  user.nik = nik;
  user.project = projectId;
  user.department = departmentId;
  user.active = active;
  user.roles = roles;

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

  const reply = `User ${result.name} with ID ${user._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
