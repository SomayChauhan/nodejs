const { createCustomError } = require("../utils/custom-error");
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const get_all_products = async (req, res, next) => {
  //http://localhost:3000/api/v1/shop/products?featured=true&company=ikea&name=a&numericFilters=price>=20,rating>=4&sort=-price,-name&fields=rating,name,price
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  // sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  // 23
  // 4 7 7 7 2

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

const create_product = async (req, res, next) => {
  const task = await Product.create(req.body);
  res.status(201).json({ task });
};

const get_product_detail = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  res.status(200).json(product);
};

const delete_product = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOneAndDelete({ _id: id });
  if (!product) {
    return next(createCustomError(`No product with id : ${id}`, 404));
  }
  res.status(200).json(product);
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
