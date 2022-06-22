const express = require("express");

const router = express.Router();

const {
  get_all_products,
  create_product,
  get_product_detail,
  delete_product,
  update_product,
  get_cart,
  add_to_cart,
  get_orders,
  post_order,
} = require("../controllers/shop");

router.route("/products").get(get_all_products).post(create_product);
router.route("/products/:id").get(get_product_detail).patch(update_product).delete(delete_product);
router.route("/cart").get(get_cart).post(add_to_cart);
router.route("/orders").get(get_orders).post(post_order);

module.exports = router;
