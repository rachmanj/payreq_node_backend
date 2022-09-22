const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      required: true,
    },
    bowheer: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
