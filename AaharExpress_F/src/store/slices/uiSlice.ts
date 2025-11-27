import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface Modal {
  id: string;
  type: 'auth' | 'cart' | 'order' | 'contact' | 'custom';
  isOpen: boolean;
  data?: any;
}

interface UIState {
  darkMode: boolean;
  notifications: Notification[];
  modals: Modal[];
  sidebarOpen: boolean;
  loading: boolean;
}

const initialState: UIState = {
  darkMode: false,
  notifications: [],
  modals: [],
  sidebarOpen: false,
  loading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({ ...action.payload, id });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    openModal: (state, action: PayloadAction<Omit<Modal, 'isOpen'>>) => {
      const existingModal = state.modals.find(m => m.id === action.payload.id);
      if (existingModal) {
        existingModal.isOpen = true;
        existingModal.data = action.payload.data;
      } else {
        state.modals.push({ ...action.payload, isOpen: true });
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const modal = state.modals.find(m => m.id === action.payload);
      if (modal) {
        modal.isOpen = false;
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  addNotification,
  removeNotification,
  openModal,
  closeModal,
  toggleSidebar,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer; 