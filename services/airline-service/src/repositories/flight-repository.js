const { Sequelize } = require('sequelize');

const CrudRepository = require('./crud-repository');
const { Flight, Airplane, Airport, City } = require('../models');
const db = require('../models');
const { addRowLockOnFlights } = require('./queries');

class FlightRepository extends CrudRepository {
  constructor() {
    super(Flight);
  }

  async getAllFlights(filter, sort) {
    const response = await Flight.findAll({
      where: filter,
      order: sort,
      include: [
        {
          model: Airplane,
          required: true, //from default outer-join ot inner-join
          as:'airplaneDetail'
        },
        {
          model: Airport,
          required: true,
          as: 'departureAirport',
          on: {
            col1: Sequelize.where(Sequelize.col("Flight.departureAirportId"), "=", Sequelize.col("departureAirport.code"))
          },
          include: {
            model: City,
            require: true
          }
        },
        {
          model: Airport,
          required: true,
          as: 'arrivalAirport',
          on: {
            col1: Sequelize.where(Sequelize.col("Flight.arrivalAirportId"), "=", Sequelize.col("arrivalAirport.code"))
          },
          include: {
            model: City,
            require: true
          }
        }
      ]
    });
    return response;
  }

  async updateRemainingSeats(flightId, seats, dec) {
    //This is for having row lock on table column, pessimitic locking
    await db.sequelize.query( addRowLockOnFlights(flightId) );
    const flight = await Flight.findByPk(flightId);

    if (!flight) {
      throw new Error("Flight not found");
    }

    // normalize value to string for consistent comparison
    const value = String(dec).toLowerCase();

    const shouldDecrement =
      dec === undefined ||
      value === '0' ||
      value === 'false';

    if (shouldDecrement) {
      await flight.decrement('totalSeats', { by: seats });
    } else {
      await flight.increment('totalSeats', { by: seats });
    }

    return flight;
  }

}

module.exports = FlightRepository;