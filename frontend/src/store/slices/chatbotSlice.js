import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatbotAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Chatbot async thunks
export const startConversation = createAsyncThunk(
  'chatbot/startConversation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatbotAPI.startConversation();
      return response.data.data.conversation;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể bắt đầu cuộc trò chuyện';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async ({ message, sessionId }, { rejectWithValue }) => {
    try {
      const response = await chatbotAPI.sendMessage(message, sessionId);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể gửi tin nhắn';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchConversationHistory = createAsyncThunk(
  'chatbot/fetchConversationHistory',
  async ({ sessionId, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await chatbotAPI.getConversationHistory(sessionId, limit);
      return response.data.data.conversation;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải lịch sử cuộc trò chuyện';
      return rejectWithValue(message);
    }
  }
);

export const fetchUserConversations = createAsyncThunk(
  'chatbot/fetchUserConversations',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await chatbotAPI.getUserConversations(limit);
      return response.data.data.conversations;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải danh sách cuộc trò chuyện';
      return rejectWithValue(message);
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'chatbot/updateUserPreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await chatbotAPI.updateUserPreferences(preferences);
      toast.success('Cập nhật sở thích thành công!');
      return response.data.data.userPreferences;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể cập nhật sở thích';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchProductRecommendations = createAsyncThunk(
  'chatbot/fetchProductRecommendations',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await chatbotAPI.getProductRecommendations(limit);
      return response.data.data.recommendations;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tải gợi ý sản phẩm';
      return rejectWithValue(message);
    }
  }
);

export const endConversation = createAsyncThunk(
  'chatbot/endConversation',
  async ({ sessionId, satisfaction }, { rejectWithValue }) => {
    try {
      const response = await chatbotAPI.endConversation(sessionId, satisfaction);
      toast.success('Kết thúc cuộc trò chuyện thành công!');
      return response.data.data.summary;
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể kết thúc cuộc trò chuyện';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  // Current conversation
  currentConversation: null,
  sessionId: null,
  messages: [],
  userPreferences: {},
  
  // Product recommendations
  recommendations: [],
  
  // User conversations history
  conversations: [],
  
  // UI state
  isOpen: false,
  isLoading: false,
  isSendingMessage: false,
  error: null,
  
  // Chatbot settings
  settings: {
    autoStart: true,
    showTyping: true,
    soundEnabled: true,
    theme: 'light',
  },
};

// Chatbot slice
const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    openChatbot: (state) => {
      state.isOpen = true;
    },
    closeChatbot: (state) => {
      state.isOpen = false;
    },
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen;
    },
    addMessage: (state, action) => {
      const { type, message, metadata } = action.payload;
      state.messages.push({
        type,
        message,
        metadata,
        timestamp: new Date().toISOString(),
      });
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setUserPreferences: (state, action) => {
      state.userPreferences = { ...state.userPreferences, ...action.payload };
    },
    clearUserPreferences: (state) => {
      state.userPreferences = {};
    },
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    resetChatbot: (state) => {
      state.currentConversation = null;
      state.sessionId = null;
      state.messages = [];
      state.recommendations = [];
      state.userPreferences = {};
      state.isOpen = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Conversation
      .addCase(startConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
        state.sessionId = action.payload.sessionId;
        state.messages = action.payload.messages || [];
        state.userPreferences = action.payload.userPreferences || {};
      })
      .addCase(startConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isSendingMessage = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSendingMessage = false;
        const { response, sessionId, recommendations, userPreferences } = action.payload;
        
        // Add user message (already added in component)
        // Add assistant response
        state.messages.push({
          type: 'assistant',
          message: response,
          timestamp: new Date().toISOString(),
        });
        
        // Update session and preferences
        state.sessionId = sessionId;
        state.userPreferences = userPreferences || state.userPreferences;
        state.recommendations = recommendations || [];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSendingMessage = false;
        state.error = action.payload;
      })
      
      // Fetch Conversation History
      .addCase(fetchConversationHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversationHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
        state.sessionId = action.payload.sessionId;
        state.messages = action.payload.messages || [];
        state.userPreferences = action.payload.userPreferences || {};
      })
      .addCase(fetchConversationHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch User Conversations
      .addCase(fetchUserConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchUserConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update User Preferences
      .addCase(updateUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPreferences = action.payload;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Product Recommendations
      .addCase(fetchProductRecommendations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchProductRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // End Conversation
      .addCase(endConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(endConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        // Keep conversation data but mark as ended
        if (state.currentConversation) {
          state.currentConversation.status = 'completed';
          state.currentConversation.summary = action.payload;
        }
      })
      .addCase(endConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  openChatbot,
  closeChatbot,
  toggleChatbot,
  addMessage,
  clearMessages,
  setUserPreferences,
  clearUserPreferences,
  setRecommendations,
  clearRecommendations,
  updateSettings,
  resetChatbot,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
