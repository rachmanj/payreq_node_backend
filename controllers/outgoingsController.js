const Payreq = require("../models/Payreq");
const User = require("../models/User");

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

// @desc    add Outgoing tx
// @route   POST /payreqs/outgoing
// @access  Private
const updateOutgoing = async (req, res) => {
  const { id, date, amount, updatedBy } = req.body;

  // get payreq from the database
  const payreq = await Payreq.findById(id).exec();

  // if no payreq found, return 400
  if (!payreq) {
    return res.status(400).json({ message: "Payreq not found" });
  }

  // check if the balance is enough
  if (payreq.outgoingTotal + amount > payreq.amount) {
    return res.status(400).json({ message: "Outgoing amount is over" });
  }

  // save field outgoingTotal
  await payreq.updateOne({
    $inc: {
      outgoingTotal: amount,
    },
  });

  // push outgoing tx
  const updatedPayreq = await payreq.updateOne(
    {
      $push: {
        outgoing: {
          date,
          amount,
          updatedBy,
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
