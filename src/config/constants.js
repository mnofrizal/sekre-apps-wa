const dotenv = require("dotenv");
dotenv.config();

const FRONT_END_URL = process.env.FRONTEND_ENDPOINT_URL;

module.exports = {
  FRONT_END_URL,
};
