require('dotenv').config();
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { initCronJobs } = require('./utils/cronScheduler');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'epoch';
const port = process.env.PORT || 3000;

// Set the base URL for the cron job
process.env.NEXT_PUBLIC_BASE_URL = dev 
  ? `http://${hostname}:${port}` 
  : process.env.NEXT_PUBLIC_BASE_URL;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Initialize cron jobs
  initCronJobs();

  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
