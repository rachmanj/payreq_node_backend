const Employee = require("../models/Employee");

// @desc    Get all employees
// @route   GET /employees
// @access  Private
const getAllEmployees = async (req, res) => {
  // Get all employees from the database
  const employees = await Employee.find().lean();

  // if no employees found, return 400
  if (!employees?.length) {
    return res.status(400).json({ message: "No employees found" });
  }

  res.json(employees);
};

// @desc   Create a new employee
// @route  POST /employees
// @access Private
const createEmployee = async (req, res) => {
  const { name, departmentId, projectId, nik } = req.body;

  // confirm data
  if (!name || !departmentId || !projectId) {
    return res
      .status(400)
      .json({ message: "Please enter all fields required" });
  }

  // check for duplicate email
  if (nik) {
    const duplicate = await Employee.findOne({ nik }).exec();

    if (duplicate) {
      return res
        .status(400)
        .json({ message: `Employee with NIK ${nik} already exist` });
    }
  }

  // create new employee
  const employee = await Employee.create(req.body);

  // respon
  if (employee) {
    res.status(201).json({ message: `Employee ${employee.name} created` });
  } else {
    res.status(400).json({ message: "Error creating employee" });
  }
};

// @desc    Update employee
// @route   PATCH /employees
// @access  Private
const updateEmployee = async (req, res) => {
  const { id, nik } = req.body;

  // confirm data
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  // check for duplicate nik
  if (nik) {
    const duplicateNik = await Employee.findOne({ nik }).exec();

    if (duplicateNik) {
      return res
        .status(400)
        .json({ message: `Employee with NIK ${nik} already exist` });
    }
  }

  // update employee
  const employee = await Employee.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  // respon
  if (employee) {
    res.status(201).json({ message: `Employee ${employee.name} updated` });
  } else {
    res.status(400).json({ message: "Error updating employee" });
  }
};

// @desc    Delete employee
// @route   DELETE /employees/:id
// @access  Private
const deleteEmployee = async (req, res) => {
  const { id } = req.body;

  // confirm data
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  // delete employee
  const employee = await Employee.findById(id).exec();

  if (!employee) {
    return res.status(400).json({ message: "Employee not found" });
  }

  const deletedEmployee = await employee.deleteOne();

  // respon
  const reply = `Employee ${employee.name} deleted`;

  res.status(201).json(reply);
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
