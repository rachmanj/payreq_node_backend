const Payreq = require("../models/Payreq");
const User = require("../models/User");

// @desc    Get all ready to realization payreqs
// @route   GET /payreqs/realizations
// @access  Private
const getAllRealizations = async (req, res) => {
  // Get all payreqs from the database
  const payreqs = await Payreq.find({
    $and: [
      { $expr: { $eq: ["$amount", "$outgoingTotal"] } },
      { "realization.realizationNo": null },
    ],
  })
    .lean()
    .exec();

  // if no payreqs found, return 400
  if (!payreqs?.length) {
    return res.status(400).json({ message: "No payreqs to realization found" });
  }

  // Payreqs with employee name
  const payreqsWithName = await Promise.all(
    payreqs.map(async (payreq) => {
      const payee = await User.findById(payreq.payee).lean().exec();
      const createdBy = await User.findById(payreq.createdBy).lean().exec();
      return {
        ...payreq,
        payee: payee.name,
        createdBy: createdBy.name,
      };
    })
  );

  res.json(payreqsWithName);
};

// @desc    Update realization data
// @route   PATCH /payreqs/realizations
// @access  Private
const updateRealization = async (req, res) => {
  const { id, realizationNo, date, amount, updatedBy } = req.body;

  // get payreq from the database
  const payreq = await Payreq.findOne({ _id: id }).exec();

  // if no payreq found, return 400
  if (!payreq) {
    return res.status(400).json({ message: "Payreq not found" });
  }

  // check if realizationNo is exist
  if (payreq.realization.realizationNo) {
    return res.status(401).json({ message: "Payreq already has realization" });
  }

  // updated Realization data
  const updatedPayreq = await payreq.updateOne({
    $set: {
      "realization.realizationNo": realizationNo,
      "realization.date": date,
      "realization.amount": amount,
      "realization.updatedBy": updatedBy,
    },
  });

  // respon
  if (updatedPayreq) {
    res.status(201).json({
      message: `Realization data updated for payreq no.${payreq.payreqNo}`,
    });
  } else {
    res.status(400).json({ message: "Error updating realization" });
  }
};

module.exports = {
  getAllRealizations,
  updateRealization,
};
