const Payreq = require("../models/Payreq");

// @desc   Get all Payreqs ready to outgoing
// @route  GET /payreqs/outgoings
// @access Private
const getAllOutgoings = async (req, res) => {
  // find all payment request with outgoingAmount less than amount and approvedDate is not null
  const payreqs = await Payreq.find({
    $and: [
      { $expr: { $lt: ["$outgoingTotal", "$amount"] } },
      { $ne: ["$approveDate", null] },
    ],
  })
    .lean()
    .exec();

  // if no payreqs found, return 400
  if (!payreqs?.length) {
    return res
      .status(400)
      .json({ message: "No payreqs ready to outgoing found" });
  }

  res.json(payreqs);
};

// @desc    add Outgoing tx
// @route   POST /payreqs/outgoing
// @access  Private
const updateOutgoing = async (req, res) => {
  const { id, date, amount, outgoingBy } = req.body;

  // get payreq from the database
  const payreq = await Payreq.findById(id).exec();

  // if no payreq found, return 400
  if (!payreq) {
    return res.status(400).json({ message: "Payreq not found" });
  }

  // check if outgoingTotal is less than amount
  if (payreq.outgoingTotal >= payreq.amount) {
    return res
      .status(401)
      .json({ message: "Payreq already has outgoing full amount" });
  }

  const sumOutgoingAmount = (await payreq.outgoingTotal) + amount;

  // save field outgoingTotal
  await payreq.updateOne({
    $set: {
      outgoingTotal: sumOutgoingAmount,
    },
  });

  // push outgoing tx
  const updatedPayreq = await payreq.updateOne(
    {
      $push: {
        outgoing: {
          date,
          amount,
          outgoingBy,
        },
      },
    },
    { new: true }
  );

  // respon
  if (updatedPayreq) {
    res.status(201).json({
      message: `Outgoing tx added to payreq ${payreq.payreqNo}`,
    });
  } else {
    res.status(400).json({ message: "Error adding outgoing tx" });
  }
};

module.exports = {
  getAllOutgoings,
  updateOutgoing,
};
