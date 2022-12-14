const Tour = require("../models/tour_model");
const APIStructuring = require("../utils/api_structuring");
const { CustomAPIError } = require("../utils/custom-error");

const get_all_tours = async (req, res, next) => {
  const features = new APIStructuring(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

const get_tour = async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    throw new Error("No tour found with that ID");
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const create_tour = async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
};

const update_tour = async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new CustomAPIError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const delete_tour = async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    throw new CustomAPIError("No tour found with that ID", 400);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  get_all_tours,
  create_tour,
  get_tour,
  update_tour,
  delete_tour,
};
