import 'dotenv/config';
import app from './app.js';
import prisma from './utils/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Check DB connection
    await prisma.$connect();
    console.log('PostgreSQL Connected via Prisma');

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
