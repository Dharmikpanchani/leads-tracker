import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import routes from './routes/index.js';
import config from './config/index.js';
import { StatusCodes } from 'http-status-codes';

const app = express();

// Security Headers (CSP disabled to allow Swagger UI inline assets)
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// CORS configuration (enabling credentials for cookies)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.ALLOWED_ORIGINS.includes(origin) || config.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body Parsing & Cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Swagger API Documentation UI & Raw JSON
const swaggerUiOptions = {
  customSiteTitle: 'Leads Tracker API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Base Route
app.use('/api', routes);

// Root Route Redirect to Docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// 404 Handler
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    statusCode: StatusCodes.NOT_FOUND,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on this server.`,
  });
});

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('Global Error caught:', err);
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(status).json({
    success: false,
    statusCode: status,
    message: err.message || 'Internal server error occurred.',
  });
});

export default app;

