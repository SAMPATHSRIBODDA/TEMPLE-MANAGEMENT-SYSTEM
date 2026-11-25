const cron = require('node-cron');
const Ticket = require('../models/Ticket');
const logger = require('../utils/logger');

const initCronJobs = () => {
  // Run every night at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    logger.info('Running cron job: Expiring old unused tickets...');
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const result = await Ticket.updateMany(
        { status: 'issued', validForDate: { $lt: yesterday } },
        { $set: { status: 'expired' } }
      );
      
      logger.info(`Cron job finished: ${result.modifiedCount} tickets expired.`);
    } catch (error) {
      logger.error('Error running ticket expiry cron job', error);
    }
  });

  // Example: Run at 23:55 every day to calculate daily closing balance
  cron.schedule('55 23 * * *', async () => {
    logger.info('Running cron job: Calculating Daily Closing Balance...');
    // Add logic here to aggregate today's receipts and notify admin
  });
};

module.exports = initCronJobs;
