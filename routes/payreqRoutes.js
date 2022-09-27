const express = require("express");
const router = express.Router();
const approvedController = require("../controllers/approvedController");
const outgoingsController = require("../controllers/outgoingsController");
const realizationsController = require("../controllers/realizationsController");

router
  .route("/")
  .get(approvedController.getAllPayreqs)
  .post(approvedController.createPayreq)
  .patch(approvedController.updatePayreq)
  .delete(approvedController.deletePayreq);

router
  .route("/outgoings")
  .get(outgoingsController.getAllOutgoings)
  .patch(outgoingsController.updateOutgoing);

router
  .route("/realizations")
  .get(realizationsController.getAllRealizations)
  .patch(realizationsController.updateRealization);

module.exports = router;
