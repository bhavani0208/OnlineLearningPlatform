const app = require('./app');
const { connectDB } = require('./config/database');
const { syncDatabase } = require('./models/index');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Step 1 - Connect to database
  await connectDB();

  // Step 2 - Sync all models/tables
  await syncDatabase();

  // Step 3 - Start server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();
