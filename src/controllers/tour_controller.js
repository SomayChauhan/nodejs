const Tour = require("../models/tour_model");
const data_factory = require("../utils/data_factory");

const get_all_tours = data_factory.getAll(Tour);
const get_tour = data_factory.getOne(Tour);
const create_tour = data_factory.createOne(Tour);
const update_tour = data_factory.updateOne(Tour);
const delete_tour = data_factory.deleteOne(Tour);


module.exports = {
  get_all_tours,
  create_tour,
  get_tour,
  update_tour,
  delete_tour,
};
