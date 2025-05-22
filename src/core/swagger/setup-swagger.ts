import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import fs from 'fs';
import path from 'path';
import express from 'express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Uber API',
      version: '1.0.0',
      description: 'uber API',
    },
  },
  apis: ['./src/**/*.swagger.yml'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Ensure the public/swagger directory exists
const swaggerPath = path.join(process.cwd(), 'public', 'swagger');
if (!fs.existsSync(swaggerPath)) {
  fs.mkdirSync(swaggerPath, { recursive: true });
}

// Write swagger.json to the public/swagger directory
fs.writeFileSync(
  path.join(swaggerPath, 'swagger.json'),
  JSON.stringify(swaggerSpec, null, 2),
);

export const setupSwagger = (app: Express) => {
  // Serve the Swagger UI from swagger-ui-express
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Serve the swagger.json file
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Serve static files from the public directory
  app.use(express.static('public'));
};
