const express = require("express");
const router = express.Router();
const payreqsController = require("../controllers/payreqsController");

router
  .route("/")
  .get(payreqsController.getAllPayreqs)
  .post(payreqsController.createPayreq)
  .patch(payreqsController.updatePayreq)
  .delete(payreqsController.deletePayreq);

router.route("/outgoing").patch(payreqsController.addOutgoing);

router.route("/realization").patch(payreqsController.addRealization);

module.exports = router;
