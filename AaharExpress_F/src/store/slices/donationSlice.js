import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import donationService from '../../services/donationService';

// Async thunks
export const createDonation = createAsyncThunk(
  'donations/create',
  async (donationData, { rejectWithValue }) => {
    try {
      const response = await donationService.createDonation(donationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserDonations = createAsyncThunk(
  'donations/fetchUserDonations',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await donationService.getUserDonations(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchImpactStats = createAsyncThunk(
  'donations/fetchImpactStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await donationService.getImpactStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecentImpact = createAsyncThunk(
  'donations/fetchRecentImpact',
  async (_, { rejectWithValue }) => {
    try {
      const response = await donationService.getRecentImpact();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDonationAnalytics = createAsyncThunk(
  'donations/fetchAnalytics',
  async (timeframe, { rejectWithValue }) => {
    try {
      const response = await donationService.getDonationAnalytics(timeframe);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDonationPreferences = createAsyncThunk(
  'donations/updatePreferences',
  async ({ userId, preferences }, { rejectWithValue }) => {
    try {
      const response = await donationService.updateDonationPreferences(userId, preferences);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  userDonations: [],
  impactStats: null,
  recentImpact: [],
  analytics: null,
  preferences: null,
  loading: false,
  error: null,
  success: false
};

const donationSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    clearDonationState: (state) => {
      state.error = null;
      state.success = false;
    },
    resetDonationState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Create donation
      .addCase(createDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userDonations.push(action.payload);
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user donations
      .addCase(fetchUserDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.userDonations = action.payload;
      })
      .addCase(fetchUserDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch impact stats
      .addCase(fetchImpactStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImpactStats.fulfilled, (state, action) => {
        state.loading = false;
        state.impactStats = action.payload;
      })
      .addCase(fetchImpactStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch recent impact
      .addCase(fetchRecentImpact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentImpact.fulfilled, (state, action) => {
        state.loading = false;
        state.recentImpact = action.payload;
      })
      .addCase(fetchRecentImpact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch analytics
      .addCase(fetchDonationAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonationAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchDonationAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update preferences
      .addCase(updateDonationPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDonationPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(updateDonationPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearDonationState, resetDonationState } = donationSlice.actions;

export default donationSlice.reducer; 