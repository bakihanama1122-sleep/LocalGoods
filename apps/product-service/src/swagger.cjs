const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "LocalGoods Product Service API",
        description: "Automatically generated Swagger docs",
        version: "1.0.0",
    },
    host: "localhost:6002",
    basePath: "/product/api",
    schemes: ["http"]
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/product.routes.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);