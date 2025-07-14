const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Xpandifi',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    servers: [
      {
        url: 'https://branchx-backend-api-4.onrender.com/api/v1', // Update if needed
      },
    ],
  },
  apis: ['./src/routes/v1/*.js'], // Path to API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
