import axios from 'axios';

const processEnv = typeof process !== 'undefined' ? process.env ?? {} : {};
const API_BASE_URL =
  import.meta.env?.VITE_API_URL ||
  'http://localhost:8080/api';

const donationService = {
  // Create a new donation
  createDonation: async (donationData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/donations`, donationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create donation');
    }
  },

  // Get donation history for a user
  getUserDonations: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user donations');
    }
  },

  // Get donation impact statistics
  getImpactStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/impact`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch impact statistics');
    }
  },

  // Get recent impact stories
  getRecentImpact: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/impact/stories`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recent impact stories');
    }
  },

  // Get donation analytics
  getDonationAnalytics: async (timeframe = 'monthly') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/analytics`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch donation analytics');
    }
  },

  // Update donation preferences
  updateDonationPreferences: async (userId, preferences) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/donations/preferences/${userId}`, preferences);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update donation preferences');
    }
  },

  // Get donation impact by category
  getImpactByCategory: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/impact/categories`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch impact by category');
    }
  },

  // Get donation goals and progress
  getDonationGoals: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/goals`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch donation goals');
    }
  },

  // Submit a community story
  submitCommunityStory: async (storyData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/donations/stories`, storyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit community story');
    }
  },

  // Get donation leaderboard
  getDonationLeaderboard: async (timeframe = 'monthly') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/leaderboard`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch donation leaderboard');
    }
  }
};

export default donationService; 