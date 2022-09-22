const Project = require("../models/Project");

// @desc    Get all projects
// @route   GET /projects
// @access  Private
const getAllProjects = async (req, res) => {
  // Get all projects from the database
  const projects = await Project.find().lean();

  // if no projects found, return 400
  if (!projects?.length) {
    return res.status(400).json({ message: "No projects found" });
  }

  res.json(projects);
};

// @desc   Create a new project
// @route  POST /projects
// @access Private
const createProject = async (req, res) => {
  const { code, projectName, location, bowheer, startDate, endDate } = req.body;

  // confirm data
  if (!code || !location || !projectName) {
    return res
      .status(400)
      .json({ message: "Please enter all fields required" });
  }

  // check for duplicate code
  const duplicate = await Project.findOne({ code }).lean().exec();

  if (duplicate) {
    return res
      .status(400)
      .json({ message: `Project code ${code} already exist` });
  }

  // create new project
  const project = await Project.create({
    code,
    projectName,
    location,
    bowheer,
    startDate,
    endDate,
  });

  // respon
  if (project) {
    res.status(201).json({ message: `Project ${project.code} created` });
  } else {
    res.status(400).json({ message: "Error creating project" });
  }
};

// @desc   Update a project
// @route  PATCH /projects
// @access Private
const updateProject = async (req, res) => {
  const { id, code } = req.body;

  // confirm data
  if (!id) {
    return res
      .status(400)
      .json({ message: "Please enter all fields required" });
  }

  // check for duplicate code
  if (code) {
    const duplicate = await Project.findOne({ code }).lean().exec();

    if (duplicate && duplicate?._id.toString() != id) {
      return res
        .status(409)
        .json({ message: `Project code ${code} already exist` });
    }
  }

  // update project
  const project = await Project.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );

  // respon
  if (project) {
    res.status(201).json({ message: `Project ${project.code} update` });
  } else {
    res.status(400).json({ message: "Error updating project" });
  }
};

// @desc   Delete a project
// @route  DELETE /projects
// @access Private
const deleteProject = async (req, res) => {
  const { id } = req.body;

  // confirm data
  if (!id) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  // Does project exist?
  const project = await Project.findById(id).exec();

  if (!project) {
    return res.status(400).json({ message: "Project not found" });
  }

  const deletedProject = await project.deleteOne();

  // respon
  const reply = `Project ${deletedProject.code} deleted`;

  res.json(reply);
};

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
};
