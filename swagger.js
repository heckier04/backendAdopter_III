import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
definition: {
    openapi: '3.0.0',
    info: {
        title: 'Adoptme API',
        version: '1.0.0',
        description: 'Documentación de la API Adoptme'
        }
    },
    apis: ['./src/routes/*.js'], 
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };