const Support = require('../models/Support');
const catchAsync = require('./../utils/catchAsync');

exports.getAllSupport = catchAsync(async (req, res, next) => {
  const support = await Support.find({});

  // SEND RESPONSE
  return res.status(200).json({
    status: true,
    results: support,
  });
});

exports.createSupport = catchAsync(async (req, res, next) => {
  const { name, phone, text } = req.body;
  const support = await Support.create({ name, phone, text });
  return res.status(201).json({
    status: true,
    result: support,
  });
});

exports.deleteSupport = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const support = await Support.findOneAndRemove({ _id: id });
  return res.status(201).json({
    status: true,
    result: 'deleted',
  });
});
