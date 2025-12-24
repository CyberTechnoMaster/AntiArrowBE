const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AntiArrow API',
            version: '1.0.0',
            description: 'API documentation for the AntiArrow game backend',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        username: { type: 'string' },
                        level: { type: 'integer' },
                        experience: { type: 'integer' },
                        role: { type: 'string' },
                        lastLogin: { type: 'string', format: 'date-time' },
                    },
                },
                LevelConfig: {
                    type: 'object',
                    properties: {
                        level: { type: 'integer' },
                        tier: { type: 'integer' },
                        levelInTier: { type: 'integer' },
                        gridSize: { type: 'integer' },
                        isBossLevel: { type: 'boolean' },
                        timeLimit: { type: 'integer', nullable: true },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
