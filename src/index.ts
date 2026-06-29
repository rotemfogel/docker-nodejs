import express from 'express';

import bodyParser from 'body-parser';

const app = express();
const port =process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_, res) => {
    const status = {"status": "ok", "version": "1.0.0", "environment": process.env.NODE_ENV};
    res.status(200).json(status);
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function gracefulShutdown(signal: NodeJS.Signals) {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
  
    server.close(() => {
      console.log('HTTP server closed.');  
      console.log('Cleanup complete. Exiting.');
      process.exit(0); 
    });
  
    setTimeout(() => {
      console.error('Shutdown timed out! Forcing exit.');
      process.exit(1);
    }, 5000).unref(); // .unref() allows the process to exit before the timer fires
  }

// Listen for standard termination requests (e.g., from Kubernetes/Docker)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Listen for terminal interrupts (e.g., hitting Ctrl+C in terminal)
process.on('SIGINT', () => gracefulShutdown('SIGINT'));