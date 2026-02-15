const { FlightRepository } = require('../repositories');
const {StatusCodes} = require('http-status-codes');
const { compareTime } = require('../utils/helpers/datetime-helpers')
const { Op, fn, col, where } = require('sequelize');

const AppError = require('../utils/errors/app-error');

const flightRepository = new FlightRepository();

async function createFlight(data) {
  try {
    if(!compareTime(data.arrivalTime ,data.departureTime)){
     throw new AppError('Arrival time must be greater than departure time', StatusCodes.BAD_REQUEST);
    }
    const flight = await flightRepository.create(data);
    return flight;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if(error.name === 'SequelizeValidationError'){
      let explanation = [];
      error.errors.forEach(err => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw new AppError('Cannot create new flight object', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getAllFlights(query) {
  let customFilter = [];
  let sortFilter = [];
  //trips = MUM-DEL
  if(query.trips){
    const [departureAirportId, arrivalAirportId] = query.trips.split("-");
    customFilter.departureAirportId = departureAirportId;
    customFilter.arrivalAirportId = arrivalAirportId;
    //TODO: add a check that they can't be same
  }

  if(query.price){
    //price = 1000-2000
    const [minPrice, maxPrice] = query.price.split("-");
    customFilter.price = {
      [Op.between]: [minPrice, ((maxPrice) == undefined) ? 20000 : maxPrice]
    }
  }

  if(query.traveller){
    customFilter.totalSeats = {
      [Op.gte]: query.traveller
    }
  }

  if (query.tripDate) {
    customFilter[Op.and] = [
      where(fn('DATE', col('departureTime')), query.tripDate)
    ];
  }

  if(query.sort){
    const params = query.sort.split(',');
    const sortFilters = params.map((param) => param.split('_'));
    sortFilter = sortFilters;
  }

  try {
    const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
    return flights;
  } catch (error) {
    console.log(error);
    throw new AppError('Cannot fetch data of all the flights', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getFlight(id) {
  try {
    const flight = await flightRepository.get(id);
    return flight;
  } catch (error) {
    if(error.statusCode === StatusCodes.NOT_FOUND){
      throw new AppError('The flight you requested is not present', error.statusCode);
    }
    throw new AppError('Cannot fetch data of the flight', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function updateSeats(data) {
  try {
    console.log(data.dec);
    const response = await flightRepository.updateRemainingSeats(data.flightId, data.seats, data.dec);
    return response;
  } catch (error) {
    throw new AppError('Cannot update data of the flight', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  createFlight,
  getAllFlights,
  getFlight,
  updateSeats
}