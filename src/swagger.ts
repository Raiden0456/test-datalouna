import { Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for the project",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
      schemas: {
        RegisterDto: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "user@example.com",
            },
            password: {
              type: "string",
              example: "securepassword",
            },
          },
        },
        LoginDto: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "user@example.com",
            },
            password: {
              type: "string",
              example: "securepassword",
            },
          },
        },
        ChangePasswordDto: {
          type: "object",
          required: ["oldPassword", "newPassword"],
          properties: {
            oldPassword: {
              type: "string",
              example: "oldpassword123",
            },
            newPassword: {
              type: "string",
              example: "newpassword456",
            },
          },
        },
        PurchaseDto: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: {
              type: "number",
              example: 1,
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Идентификатор товара",
            },
            name: {
              type: "string",
              description: "Название товара",
            },
            price: {
              type: "number",
              description: "Цена товара",
            },
            description: {
              type: "string",
              description: "Описание товара",
            },
          },
        },
      },
    },
  },
  apis: ["./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
