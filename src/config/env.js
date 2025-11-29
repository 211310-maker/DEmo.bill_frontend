const ENV = process.env['REACT_APP_ENV'] || process.env['NODE_ENV'];

const API_BASE_URLS = {
  local: 'http://localhost:5000',
  staging:
    process.env['REACT_APP_STAGING_API_BASE_URL'] ||
    process.env['REACT_APP_API_BASE_URL'],
  production: 'https://demo-backend.onrender.com',
};

const resolveBaseUrl = () => {
  if (ENV === 'local' || ENV === 'development') return API_BASE_URLS.local;
  if (ENV === 'staging') return API_BASE_URLS.staging || API_BASE_URLS.production;
  if (ENV === 'production') return API_BASE_URLS.production;
  return process.env['REACT_APP_API_BASE_URL'] || API_BASE_URLS.production;
};

const cfg = {
  ENV,
  API_BASE_URL: resolveBaseUrl(),
};

export default cfg;
