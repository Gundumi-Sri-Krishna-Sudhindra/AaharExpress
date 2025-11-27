import axios from 'axios';

const processEnv = typeof process !== 'undefined' ? process.env ?? {} : {};
const API_BASE_URL =
  import.meta.env?.VITE_API_URL ||
  'http://localhost:8080/api';

// Function to check API endpoints
const checkApiEndpoints = async () => {
  console.log('Checking API endpoints...');
  
  const endpoints = [
    { url: `${API_BASE_URL}/auth/signin`, method: 'OPTIONS', name: 'Authentication - Sign In' },
    { url: `${API_BASE_URL}/users/me`, method: 'OPTIONS', name: 'User - Current User' },
    { url: `${API_BASE_URL}/users/username/test`, method: 'OPTIONS', name: 'User - By Username' },
    { url: `${API_BASE_URL}/orders/user/1`, method: 'OPTIONS', name: 'Orders - By User ID' }
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Checking ${endpoint.name} at ${endpoint.url}`);
      const response = await axios({
        method: endpoint.method,
        url: endpoint.url,
        timeout: 5000 // 5 second timeout
      });
      
      results.push({
        endpoint: endpoint.name,
        status: 'Available',
        statusCode: response.status,
        methods: response.headers?.['access-control-allow-methods'] || 'Unknown'
      });
      
      console.log(`✅ ${endpoint.name} is available`);
    } catch (error) {
      results.push({
        endpoint: endpoint.name,
        status: 'Error',
        statusCode: error.response?.status || 'Network Error',
        error: error.message
      });
      
      console.error(`❌ ${endpoint.name} check failed:`, error.message);
    }
  }
  
  console.table(results);
  return results;
};

// Function to test authentication flow
const testAuthFlow = async (username, password) => {
  console.log('Testing authentication flow...');
  
  try {
    // Step 1: Login
    console.log('Step 1: Login attempt');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, {
      username,
      password
    });
    
    console.log('Login successful:', loginResponse.data);
    const token = loginResponse.data.accessToken;
    
    if (!token) {
      console.error('No token received in login response');
      return { success: false, stage: 'login', error: 'No token received' };
    }
    
    // Step 2: Get user data with token
    console.log('Step 2: Fetching user data with token');
    const userResponse = await axios.get(
      `${API_BASE_URL}/users/username/${loginResponse.data.username}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('User data fetched successfully:', userResponse.data);
    
    // Step 3: Test token on protected endpoint
    console.log('Step 3: Testing token on protected endpoint');
    const meResponse = await axios.get(
      `${API_BASE_URL}/users/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('Protected endpoint access successful:', meResponse.data);
    
    return { 
      success: true, 
      token,
      userData: userResponse.data,
      tokenTest: meResponse.data
    };
  } catch (error) {
    console.error('Auth flow test failed:', error.response?.data || error.message);
    return { 
      success: false, 
      stage: error.config?.url || 'unknown',
      error: error.response?.data || error.message
    };
  }
};

export { checkApiEndpoints, testAuthFlow }; 