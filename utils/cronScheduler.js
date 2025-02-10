const cron = require('node-cron');
const axios = require('axios');

// Function to call the cron API endpoint
async function runArchiveCron() {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cron`);
        console.log('Cron job completed:', response.data);
    } catch (error) {
        console.error('Cron job failed:', error);
    }
}

// Schedule the cron job to run daily at midnight
function initCronJobs() {
    // Run at midnight every day
    cron.schedule('0 0 * * *', () => {
        console.log('Running daily archive cron job...');
        runArchiveCron();
    });

    console.log('Cron jobs initialized');
}

module.exports = { initCronJobs };
