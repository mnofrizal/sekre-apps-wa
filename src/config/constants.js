const dotenv = require("dotenv");
dotenv.config();

const FRONT_END_URL = process.env.FRONTEND_ENDPOINT_URL;
const BACK_END_URL = process.env.BACKEND_ENDPOINT_URL;

module.exports = {
  FRONT_END_URL,
  BACK_END_URL,
};
