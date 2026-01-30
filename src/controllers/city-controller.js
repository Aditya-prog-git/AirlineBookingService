const { StatusCodes } = require('http-status-codes');

const { Cityservice } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

/**
  * POST : /cities
  * req-body {
  *   name: 'London'
  * }
*/
async function createCity(req, res) {
  try {
    const city = await Cityservice.createCity({
      name: req.body.name
    })
    SuccessResponse.data = city;
    return res
              .status(StatusCodes.CREATED)
              .json(SuccessResponse)
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse)
  }
}

module.exports = {
  createCity,
}