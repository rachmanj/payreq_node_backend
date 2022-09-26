const Payreq = require("../models/payreq");

// @desc    Get all payreqs
// @route   GET /payreqs
// @access  Private
const getAllPayreqs = async (req, res) => {
  // Get all payreqs from the database
  const payreqs = await Payreq.find().lean();

  // if no payreqs found, return 400
  if (!payreqs?.length) {
    return res.status(400).json({ message: "No payreqs found" });
  }

  res.json(payreqs);
};

// @desc   Create a new payreq
// @route  POST /payreqs
// @access Private
const createPayreq = async (req, res) => {
  const { payreqNo, amount, employeeId } = req.body;

  // confirm data
  if (!payreqNo || !amount || !employeeId) {
    return res
      .status(400)
      .json({ message: "Please enter all fields required" });
  }

  // check for duplicate payreqNo
  const duplicate = await Payreq.findOne({ payreqNo }).lean().exec();

  if (duplicate) {
    return res
      .status(400)
      .json({ message: `Payreq No ${payreqNo} already exist` });
  }

  // create new payreq
  const payreq = await Payreq.create(req.body);

  // respon
  if (payreq) {
    res.status(201).json({ message: `Payreq ${payreq.payreqNo} created` });
  } else {
    res.status(400).json({ message: "Error creating payreq" });
  }
};

// @desc    Update a payreq
// @route   PATCH /payreqs/:id
// @access  Private
const updatePayreq = async (req, res) => {
  const { id, payreqNo } = req.body;

  // get payreq from the database
  const payreq = await Payreq.findById(id).lean();

  // if no payreq found, return 400
  if (!payreq) {
    return res.status(400).json({ message: "Payreq not found" });
  }

  // check duplicate payreqNo
  if (payreqNo) {
    const duplicate = await Payreq.findOne({
      payreqNo,
    }).lean();

    if (duplicate && duplicate._id != id) {
      return res
        .status(400)
        .json({ message: `Payreq No ${req.body.payreqNo} already exist` });
    }
  }

  // update payreq
  const updatedPayreq = await Payreq.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  // respon
  if (updatedPayreq) {
    res
      .status(201)
      .json({ message: `Payreq ${updatedPayreq.payreqNo} updated` });
  } else {
    res.status(400).json({ message: "Error updating payreq" });
  }
};

// @desc    Delete a payreq
// @route   DELETE /payreqs/:id
// @access  Private
const deletePayreq = async (req, res) => {
  const { id } = req.body;

  // get payreq from the database
  const payreq = await Payreq.findById(id).lean();

  // if no payreq found, return 400
  if (!payreq) {
    return res.status(400).json({ message: "Payreq not found" });
  }

  // delete payreq
  const deletedPayreq = await Payreq.findByIdAndDelete(id);

  // respon
  if (deletedPayreq) {
    res
      .status(201)
      .json({ message: `Payreq ${deletedPayreq.payreqNo} deleted` });
  } else {
    res.status(400).json({ message: "Error deleting payreq" });
  }
};

// @desc    add Realization tx
// @route   POST /payreqs/realization
// @access  Private
const addRealization = async (req, res) => {
  const { id, realizationNo, date, amount, realizationBy } = req.body;

  // get payreq from the database
  const payreq = await Payreq.findById(id).lean();

  // if no payreq found, return 400
  if (!payreq) {
    return res.status(400).json({ message: "Payreq not found" });
  }

  // add realization tx
  const updatedPayreq = await Payreq.findByIdAndUpdate(
    id,
    {
      realization: {
        realizationNo,
        date,
        amount,
        realizationBy,
      },
      variance: payreq.amount - amount,
    },
    { new: true }
  );

  // respon
  if (updatedPayreq) {
    /* {
      message: `Realization tx added to payreq ${updatedPayreq.payreqNo}`,
    } */
    res.status(201).json(updatedPayreq);
  } else {
    res.status(400).json({ message: "Error adding realization tx" });
  }
};

module.exports = {
  getAllPayreqs,
  createPayreq,
  updatePayreq,
  deletePayreq,
  addRealization,
};
