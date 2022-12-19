const { createCustomError } = require("../utils/custom-error");
const Product = require("../models/product_model");
const Order = require("../models/order_model");
const APIStructuring = require("../utils/api_structuring");

const get_all_products = async (req, res, next) => {
  const features = new APIStructuring(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const products = await features.query;
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      products,
    },
  });
};

const create_product = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
};

const get_product_detail = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
};

const delete_product = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOneAndDelete({ _id: id });
  if (!product) {
    return next(createCustomError(`No product with id : ${id}`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};

const update_product = async (req, res, next) => {};

const get_cart = async (req, res, next) => {
  console.log(req.user, "userrrrrrrrrr");
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
