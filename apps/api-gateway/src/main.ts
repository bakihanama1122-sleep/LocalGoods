/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import initializeSiteConfig from "./libs/initializeSite.config";
// import swaggerUi from "swagger-ui-express";
// import axios from "axios";
import cookieParser from "cookie-parser";

import * as path from "path";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100),
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => {
    const safeIp = ipKeyGenerator(req);
    return req.user ? `${safeIp}-${req.user.id}` : safeIp;
  },
});

app.use(limiter);

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/gateway-health", (req, res) => {
  res.send({ message: "Welcome to api-gateway!" });
});


app.use("/chatting", proxy("http://localhost:6006", {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Forward cookies
    if (srcReq.headers.cookie) {
      proxyReqOpts.headers.cookie = srcReq.headers.cookie;
    }
    return proxyReqOpts;
  }
}));
app.use("/chatbot", proxy("http://localhost:6007", {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Forward cookies
    if (srcReq.headers.cookie) {
      proxyReqOpts.headers.cookie = srcReq.headers.cookie;
    }
    return proxyReqOpts;
  }
}));
app.use("/admin", proxy("http://localhost:6005", {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Forward cookies
    if (srcReq.headers.cookie) {
      proxyReqOpts.headers.cookie = srcReq.headers.cookie;
    }
    return proxyReqOpts;
  }
}));
app.use("/order", proxy("http://localhost:6004", {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Forward cookies
    if (srcReq.headers.cookie) {
      proxyReqOpts.headers.cookie = srcReq.headers.cookie;
    }
    return proxyReqOpts;
  }
}));
app.use("/seller", proxy("http://localhost:6003", {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Forward cookies
    if (srcReq.headers.cookie) {
      proxyReqOpts.headers.cookie = srcReq.headers.cookie;
    }
    return proxyReqOpts;
  }
}));
app.use("/product", proxy("http://localhost:6002", {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Forward cookies
    if (srcReq.headers.cookie) {
      proxyReqOpts.headers.cookie = srcReq.headers.cookie;
    }
    return proxyReqOpts;
  }
}));
app.use("/", proxy("http://localhost:6001", {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Forward cookies
    if (srcReq.headers.cookie) {
      proxyReqOpts.headers.cookie = srcReq.headers.cookie;
    }
    return proxyReqOpts;
  }
}));

const port = process.env.PORT || 8081;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
  try {
    initializeSiteConfig();
    console.log("Site config initalized successfully!");
  } catch (error) {
    console.error("Failed to initalize site config: ", error);
  }
});
server.on("error", console.error);
