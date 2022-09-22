const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nik: {
      type: String,
      default: null,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
