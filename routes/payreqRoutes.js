const express = require("express");
const router = express.Router();
const approvedController = require("../controllers/approvedController");
const outgoingsController = require("../controllers/outgoingsController");

router
  .route("/")
  .get(approvedController.getAllPayreqs)
  .post(approvedController.createPayreq)
  .patch(approvedController.updatePayreq)
  .delete(approvedController.deletePayreq);

router
  .route("/outgoings")
  .get(outgoingsController.getAllOutgoings)
  .patch(outgoingsController.addOutgoing);

// router.route("/realization").patch(payreqsController.addRealization);

module.exports = router;
