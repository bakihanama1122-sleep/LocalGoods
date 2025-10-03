const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "LocalGoods Product Service API",
        description: "Automatically generated Swagger docs",
        version: "1.0.0",
    },
    host: "localhost:6002",
    basePath: "/api",
    schemes: ["http"]
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/product.router.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);