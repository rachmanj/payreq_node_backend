const mongoose = require("mongoose");

const payreqSchema = new mongoose.Schema(
  {
    payreqNo: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "Advance",
    },
    amount: {
      type: Number,
      required: true,
    },
    payee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    priority: {
      type: Number,
      default: 1,
    },
    approveDate: {
      type: Date,
      default: null,
    },
    outgoing: [
      {
        date: {
          type: Date,
          default: null,
        },
        amount: {
          type: Number,
          default: null,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
      },
    ],
    outgoingTotal: {
      type: Number,
      default: 0,
    },
    realization: {
      realizationNo: {
        type: String,
        default: null,
      },
      date: {
        type: Date,
        default: null,
      },
      amount: {
        type: Number,
        default: null,
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
    verify: {
      date: {
        type: Date,
        default: null,
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
    variance: {
      type: Number,
      default: null,
    },
    remarks: {
      type: String,
      default: null,
    },
    rabId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Rab",
    },
    costCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payreq", payreqSchema);
