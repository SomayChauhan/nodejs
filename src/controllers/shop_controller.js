const { createCustomError } = require("../utils/custom_error");
const Product = require("../models/product_model");
const Order = require("../models/order_model");
const data_factory = require("../utils/data_factory");

const get_all_products = data_factory.getAll(Product);
const create_product = data_factory.createOne(Product);
const get_product_detail = data_factory.getOne(Product);
const delete_product = data_factory.deleteOne(Product);
const update_product = data_factory.updateOne(Product);

const get_cart = async (req, res, next) => {
  const cart = await req.user.populate("cart");
  res.status(201).json(cart);
};

const add_to_cart = async (req, res, next) => {
  const prodId = req.body.productId;
  const product = await Product.findById(prodId);
  if (!product) {
    return next(createCustomError(`No product with id : ${id}`, 404));
  }
  const rr = await req.user.addToCart(product);
  res.status(200).json(rr);
};

const get_orders = async (req, res, next) => {
  const orders = await Order.find({ userId: req.user._id });
  res.status(201).json(orders);
};

const post_order = async (req, res, next) => {
  const cart = req.user.cart;
  const order = await Order.create({
    products: cart.items,
    userId: req.user._id,
  });
  res.json(order);
};

module.exports = {
  get_all_products,
  create_product,
  get_product_detail,
  delete_product,
  update_product,
  get_cart,
  add_to_cart,
  get_orders,
  post_order,
};
