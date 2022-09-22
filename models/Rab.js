const mongoose = require("mongoose");

const rabSchema = new mongoose.Schema(
  {
    nomor: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Department",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    amount: {
      type: Number,
      required: true,
    },
    payreqs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Payreq",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rab", rabSchema);
