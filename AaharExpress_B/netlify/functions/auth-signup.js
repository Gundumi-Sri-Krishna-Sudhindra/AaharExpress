// Netlify function proxying /api/auth/signup to the Spring Boot backend
const axios = require('axios');

const allowedOrigins = [
  'https://aahar-express-f.vercel.app',
  'http://localhost:5173',
  'http://localhost:5175',
  'http://localhost:8888'
];

const springBootBaseUrl =
  process.env.SPRING_BOOT_BASE_URL || 'http://localhost:8080';

exports.handler = async function (event) {
  const requestOrigin = event.headers.origin;
  const origin = allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : allowedOrigins[0];

  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const requestBody = JSON.parse(event.body || '{}');
    const springBootUrl = `${springBootBaseUrl}/api/auth/signup`;

    const response = await axios.post(springBootUrl, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error forwarding signup request:', error.response || error);

    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        message: 'Error processing signup request',
        error: error.response?.data || error.message
      })
    };
  }
};