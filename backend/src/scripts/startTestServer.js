process.env.NODE_ENV = "test";

process.env.PORT =
  process.env.TEST_PORT
  ?? "5001";

process.env.MONGO_URI =
  process.env.TEST_MONGO_URI
  ?? "mongodb://127.0.0.1:27017/sigc_gas_test";

await import("../server.js");