const express = require("express");
const {
  get_all_tours,
  create_tour,
  get_tour,
  update_tour,
  delete_tour,
} = require("../controllers/tour_controller");

const router = express.Router();

router.route("/").get(get_all_tours).post(create_tour);
router.route("/:id").get(get_tour).patch(update_tour).delete(delete_tour);

module.exports = router;
