import app from './src/app.js';
import config from './src/config/index.js';
import { initDb } from './src/config/db.js';

const startServer = async () => {
  try {
    // Initialize database tables
    await initDb();

    app.listen(config.PORT, () => {
      console.log(`=============================================`);
      console.log(`🚀 Leads Tracker API Server running on port ${config.PORT}`);
      console.log(`🌍 Environment: ${config.NODE_ENV}`);
      console.log(`🔗 API Base URL: http://localhost:${config.PORT}/api`);
      console.log(`📖 Swagger Docs: http://localhost:${config.PORT}/api-docs`);
      console.log(`=============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
