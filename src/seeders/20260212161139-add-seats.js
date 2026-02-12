'use strict';

const { Enums } = require('../utils/common');
const { BUSINESS, ECONOMY, PREMIUM_ECONOMY, FIRST_CLASS } = Enums.SEAT_TYPE;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */


    // Fetch all airplane IDs dynamically
    const airplanes = await queryInterface.sequelize.query(
      `SELECT id FROM Airplanes;`
    );

    const airplaneIds = airplanes[0].map(a => a.id);

    const seats = [];

    for (const airplaneId of airplaneIds) {
      for (let row = 1; row <= 20; row++) {
        for (let col of ['A', 'B', 'C', 'D', 'E', 'F']) {

          let seatType = ECONOMY;

          if (row === 1) {
            seatType = FIRST_CLASS;
          } else if (row <= 3) {
            seatType = BUSINESS;
          } else if (row <= 6) {
            seatType = PREMIUM_ECONOMY;
          }

          seats.push({
            airplaneId,
            row,
            col,
            type: seatType,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    await queryInterface.bulkInsert('Seats', seats);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Seats', null, {});
  }
};
