// API Client for FastAPI Backend Integration
import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cloudrun-742666648332.europe-west1.run.app';
const API_KEY = import.meta.env.VITE_API_KEY;
const DEBUG = import.meta.env.VITE_DEBUG === 'true';



// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45 second timeout for CV generation (needs more time)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor to add authentication and logging
apiClient.interceptors.request.use(
  (config) => {
    // Add API key to headers if available
    if (API_KEY) {
      config.headers['x-api-key'] = API_KEY;
    }
    
    // Add request timestamp
    config.metadata = { startTime: new Date() };
    
    // Debug logging
    if (DEBUG) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;
    
    // Debug logging
    if (DEBUG) {
      console.log('✅ API Response:', {
        status: response.status,
        duration: `${duration}ms`,
        data: response.data
      });
    }
    
    return response;
  },
  (error) => {
    // Calculate request duration if metadata exists
    const duration = error.config?.metadata ? 
      new Date() - error.config.metadata.startTime : 'unknown';
    
    // Enhanced error logging
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      duration: `${duration}ms`,
      message: error.message,
      data: error.response?.data
    });
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('🔐 Authentication failed - check API key');
          break;
        case 403:
          console.error('🚫 Access forbidden - insufficient permissions');
          break;
        case 404:
          console.error('🔍 API endpoint not found');
          break;
        case 429:
          console.error('⏱️ Rate limit exceeded - please wait');
          break;
        case 500:
          console.error('💥 Internal server error');
          break;
        default:
          console.error(`🔥 HTTP ${status} error:`, data?.message || 'Unknown error');
      }
    } else if (error.request) {
      // Network error
      console.error('🌐 Network error - check your connection');
    } else {
      // Other error
      console.error('⚠️ Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Methods for Future Backend Integration
export const api = {
  // Health check
  async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.log('🏥 Health check failed (expected in development)');
      return { status: 'unavailable', message: 'Backend not connected' };
    }
  },

  // Contact form submission
  async submitContact(contactData) {
    try {
      const response = await apiClient.post('/api/contact', contactData);
      return response.data;
    } catch (error) {
      console.log('📧 Contact submission failed (expected in development)');
      throw error;
    }
  },

  // AI content generation (future feature)
  async generateAIContent(prompt, options = {}) {
    try {
      const response = await apiClient.post('/api/ai/generate', {
        prompt,
        ...options
      });
      return response.data;
    } catch (error) {
      console.log('🤖 AI generation failed (expected in development)');
      throw error;
    }
  },

  // Custom analytics submission (beyond PostHog)
  async submitAnalytics(eventData) {
    try {
      const response = await apiClient.post('/api/analytics', eventData);
      return response.data;
    } catch (error) {
      console.log('📊 Analytics submission failed (expected in development)');
      throw error;
    }
  },

  // Game score submission
  async submitGameScore(scoreData) {
    try {
      const response = await apiClient.post('/api/game/score', scoreData);
      return response.data;
    } catch (error) {
      console.log('🎮 Game score submission failed (expected in development)');
      throw error;
    }
  },

  // Query AI endpoint
  async query(message) {
    try {
      const response = await apiClient.post('/api/v1/query', { message });
      return response.data;
    } catch (error) {
      console.error('🤖 AI query failed:', error);
      throw error;
    }
  },

  // Game CV bullet generation - simplified approach
  async generateCVBullets(options = {}) {
    try {
      const requestData = {
        real_bullets_count: options.realCount || 3,
        fake_bullets_count: options.fakeCount || 1,
        real_temperature: options.realTemperature || 0.0,
        fake_temperature: options.fakeTemperature || 0.6,
        role: options.role || 'product_manager'
      };
      
      const response = await apiClient.post('/api/v1/game/generate-cv-bullets', requestData);
      return response.data;
    } catch (error) {
      console.error('🎮 Game CV bullet generation failed:', error);
      console.error('🎮 Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        requestData
      });
      throw error;
    }
  },

  // Prefetch bullets for better performance
  async prefetchBullets(options = {}) {
    try {
      const requestData = {
        session_id: options.sessionId || `game_${Date.now()}`,
        total_questions: options.totalQuestions || 20,
        buffer_size: options.bufferSize || 15,
        role: options.role || 'product_manager',
        difficulty_progression: options.difficultyProgression || 'linear',
        rotation_count: options.rotationCount || 1,
        exclude_ids: options.excludeIds || [],
        request_randomization: options.requestRandomization || true,
        session_progress: options.sessionProgress || 0.0
      };
      
      const response = await apiClient.post('/api/v1/game/prefetch-bullets', requestData);
      return response.data;
    } catch (error) {
      console.error('🎮 Game bullet prefetch failed:', error);
      throw error;
    }
  }
};

// Utility functions
export const apiUtils = {
  // Check if API is available
  async isApiAvailable() {
    try {
      await api.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  },

  // Handle API errors gracefully
  handleApiError(error, fallbackMessage = 'An error occurred') {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return fallbackMessage;
  },

  // Format API response data
  formatResponse(response) {
    return {
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    };
  }
};

// Export default client for advanced usage
export default apiClient;

// Development mode notifications
if (import.meta.env.DEV) {
  console.log('🔧 API Client initialized in development mode');
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('🔑 API Key configured:', !!API_KEY);
  
  // Test API availability on startup
  api.healthCheck().then(result => {
    if (result.status === 'unavailable') {
      console.log('ℹ️ Backend not available - running in frontend-only mode');
    }
  });
}