const express = require("express");
const router = express.Router();
const approvedController = require("../controllers/approvedController");
const outgoingsController = require("../controllers/outgoingsController");
const realizationsController = require("../controllers/realizationsController");
const verifyController = require("../controllers/verifyController");

//approved payreqs
router
  .route("/")
  .get(approvedController.getAllPayreqs)
  .post(approvedController.createPayreq)
  .patch(approvedController.updatePayreq)
  .delete(approvedController.deletePayreq);

// outgoings payreqs
router
  .route("/outgoings")
  .get(outgoingsController.getAllOutgoings)
  .patch(outgoingsController.updateOutgoing);

// realizations payreqs
router
  .route("/realizations")
  .get(realizationsController.getAllRealizations)
  .patch(realizationsController.updateRealization);

// verify payreqs
router
  .route("/verify")
  .get(verifyController.getAllVerify)
  .patch(verifyController.updateVerify);

module.exports = router;
