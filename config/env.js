const { config } = require('dotenv');

function envConfig() {
  let envPath = '';
  switch (process.env.NODE_ENV) {
    case 'development':
      envPath = '.env.development';
      break;
    case 'production':
      envPath = '.env.production';
      break;
    default:
      envPath = '.env.development';
  }

  config({ path: envPath });
}

module.exports = envConfig;
