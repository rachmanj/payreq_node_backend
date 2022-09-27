const Payreq = require("../models/Payreq");
const User = require("../models/User");

// @desc    Get all ready to verify payreqs
// @route   GET /payreqs/verify
// @access  Private
const getAllVerify = async (req, res) => {
  //get all payreqs ready to be verified
  const payreqs = await Payreq.find({
    $and: [
      { "realization.realizationNo": { $ne: null } },
      { "verify.date": null },
    ],
  })
    .lean()
    .exec();

  //if no payreqs found
  if (!payreqs.length) {
    return res.status(400).json({ message: "No payreqs to verify found" });
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

// @desc    update verification data
// @route   PATCH /payreqs/verify
// @access  Private
const updateVerify = async (req, res) => {
  const { id, date, updatedBy } = req.body;

  // find payreq
  const payreq = await Payreq.findById(id).exec();

  // if no payreq found, return 400
  if (!payreq) {
    return res.status(400).json({ message: "Payreq not found" });
  }

  // update payreq
  const updatedPayreq = await payreq.updateOne({
    $set: {
      "verify.date": date,
      "verify.updatedBy": updatedBy,
    },
  });

  // respon
  if (updatedPayreq) {
    res.status(201).json({
      message: `Verification data updated for payreq no.${payreq.payreqNo}`,
    });
  } else {
    res.status(400).json({ message: "Error updating verification" });
  }
};

module.exports = {
  getAllVerify,
  updateVerify,
};
