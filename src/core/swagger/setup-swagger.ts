import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { Express } from 'express';
import express from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'Your API Description',
    },
    servers: [
      {
        url: '/',
        description: 'Current server',
      },
    ],
  },
  apis: ['./src/**/*.swagger.yml'],
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Express) => {
  // Serve Swagger UI static files
  const swaggerUiAssetPath = require('swagger-ui-express').absolutePath();
  app.use('/api', express.static(swaggerUiAssetPath));

  // Setup Swagger UI
  app.use('/api', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};
