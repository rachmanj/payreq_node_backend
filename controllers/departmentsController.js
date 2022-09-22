const Department = require("../models/department");

// @desc    Get all departments
// @route   GET /departments
// @access  Private
const getAllDepartments = async (req, res) => {
  // Get all departments from the database
  const departments = await Department.find();

  // if no departments found, return 400
  if (!departments?.length) {
    return res.status(400).json({ message: "No departments found" });
  }

  res.json(departments);
};

// @desc   Create a new department
// @route  POST /departments
// @access Private
const createDepartment = async (req, res) => {
  const { name } = req.body;

  // confirm data
  if (!name) {
    return res
      .status(400)
      .json({ message: "Please enter all fields required" });
  }

  // check for duplicate name
  const duplicate = await Department.findOne({ name }).lean().exec();

  if (duplicate) {
    return res
      .status(400)
      .json({ message: `Department ${name} already exist` });
  }

  // create new department
  const department = await Department.create({
    name,
  });

  // respon
  if (department) {
    res.status(201).json({ message: `Department ${department.name} created` });
  } else {
    res.status(400).json({ message: "Error creating department" });
  }
};

// @desc   Update a department
// @route  PATCH /departments
// @access Private
const updateDepartment = async (req, res) => {
  const { id, name } = req.body;

  // confirm data
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  // check for duplicate name
  const duplicate = await Department.findOne({ name }).lean().exec();

  if (duplicate && duplicate?._id.toString() != id) {
    return res
      .status(400)
      .json({ message: `Department ${name} already exist` });
  }

  // update department
  const department = await Department.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );

  // respon
  if (department) {
    res.status(201).json({ message: `Department ${department.name} updated` });
  } else {
    res.status(400).json({ message: "Error updating department" });
  }
};

// @desc   Delete a department
// @route  DELETE /departments
// @access Private
const deleteDepartment = async (req, res) => {
  const { id } = req.body;

  // confirm data
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  // check if department exist
  const department = await Department.findById(id).exec();

  // delete department
  const deletedDepartment = await department.deleteOne();

  const reply = `Department ${deletedDepartment.name} deleted`;

  res.json(reply);
};

module.exports = {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
