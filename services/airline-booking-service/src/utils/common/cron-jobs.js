const cron = require('node-cron');

const {BookingService} = require('../../services/index');

function scheduleCrons() {
  cron.schedule('*/30 * * * *', async () => {
    await BookingService.cancelOldBookings();
  });
}

module.exports = scheduleCrons;