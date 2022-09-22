const express = require("express");
const router = express.Router();
const departmentsController = require("../controllers/departmentsController");

router
  .route("/")
  .get(departmentsController.getAllDepartments)
  .post(departmentsController.createDepartment)
  .patch(departmentsController.updateDepartment)
  .delete(departmentsController.deleteDepartment);

module.exports = router;
