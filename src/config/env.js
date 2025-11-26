// frontend/src/config/env.js

// LOCAL config: used when REACT_APP_ENV is not "production"
const local = {
  ENV: process.env.REACT_APP_ENV || "local",
  // default to localhost backend for local dev
  API_BASE_URL:
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
};

// PROD config: used when REACT_APP_ENV === "production"
const prod = {
  ENV: process.env.REACT_APP_ENV || "production",
  // on Render, you'll set REACT_APP_API_BASE_URL to:
  // https://demo-backend-60mu.onrender.com
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
};

const config = {
  // common config values
  MAX_ATTACHMENT_SIZE: 5000000,
  // choose between local/prod
  ...(process.env.REACT_APP_ENV === "production" ? prod : local),
};

export default config;
