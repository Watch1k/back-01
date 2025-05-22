import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Videos API',
      version: '1.0.0',
      description: 'Your API Description',
    },
    servers: [
      {
        url: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:5001',
      },
    ],
  },
  apis: ['./src/**/*.swagger.yml'],
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Express) => {
  // Setup Swagger UI with explicit options to ensure proper asset serving
  const swaggerUiOpts = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customCssUrl: '/public/css/swagger-ui.css',
    customJs: [
      '/public/js/swagger-ui-bundle.js',
      '/public/js/swagger-ui-standalone-preset.js',
    ],
    swaggerOptions: {
      url: '/api/swagger.json',
    },
  };

  // Serve the Swagger spec as JSON
  app.get('/api/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Setup Swagger UI
  app.use('/api', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUiOpts));
};
