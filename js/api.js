// api.js

import { CONFIG } from "./config.js";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "請求失敗");
  }
  return response.json();
};

const API = {
  // 書籍相關 API
  books: {
    getAll: async () => {
      const response = await axios.get(`${CONFIG.API_BASE_URL}/books/`);
      return handleResponse(response);
    },

    get: async (id) => {
      const response = await axios.get(`${CONFIG.API_BASE_URL}/books/${id}/`);
      return handleResponse(response);
    },

    create: async (data) => {
      const response = await axios.post(`${CONFIG.API_BASE_URL}/books/`, data);
      return handleResponse(response);
    },

    update: async (id, data) => {
      const response = await axios.put(
        `${CONFIG.API_BASE_URL}/books/${id}/`,
        data
      );
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await axios.delete(
        `${CONFIG.API_BASE_URL}/books/${id}/`
      );
      return handleResponse(response);
    },

    search: async (query) => {
      const response = await axios.get(
        `${CONFIG.API_BASE_URL}/books/search/?q=${query}`
      );
      return handleResponse(response);
    },

    filterByCategory: async (categoryId) => {
      const response = await axios.get(
        `${CONFIG.API_BASE_URL}/books/?category=${categoryId}`
      );
      return handleResponse(response);
    },
  },

  // 分類相關 API
  categories: {
    getAll: async () => {
      const response = await axios.get(`${CONFIG.API_BASE_URL}/categories/`);
      return handleResponse(response);
    },

    get: async (id) => {
      const response = await axios.get(
        `${CONFIG.API_BASE_URL}/categories/${id}/`
      );
      return handleResponse(response);
    },

    create: async (data) => {
      const response = await axios.post(
        `${CONFIG.API_BASE_URL}/categories/`,
        data
      );
      return handleResponse(response);
    },

    update: async (id, data) => {
      const response = await axios.put(
        `${CONFIG.API_BASE_URL}/categories/${id}/`,
        data
      );
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await axios.delete(
        `${CONFIG.API_BASE_URL}/categories/${id}/`
      );
      return handleResponse(response);
    },
  },

  // 會員相關 API
  members: {
    getAll: async () => {
      const response = await axios.get(`${CONFIG.API_BASE_URL}/members/`);
      return handleResponse(response);
    },

    get: async (id) => {
      const response = await axios.get(`${CONFIG.API_BASE_URL}/members/${id}/`);
      return handleResponse(response);
    },

    create: async (data) => {
      const response = await axios.post(
        `${CONFIG.API_BASE_URL}/members/`,
        data
      );
      return handleResponse(response);
    },

    update: async (id, data) => {
      const response = await axios.put(
        `${CONFIG.API_BASE_URL}/members/${id}/`,
        data
      );
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await axios.delete(
        `${CONFIG.API_BASE_URL}/members/${id}/`
      );
      return handleResponse(response);
    },

    getBorrowHistory: async (id) => {
      const response = await axios.get(
        `${CONFIG.API_BASE_URL}/members/${id}/borrow-history/`
      );
      return handleResponse(response);
    },

    activate: async (id) => {
      const response = await axios.post(
        `${CONFIG.API_BASE_URL}/members/${id}/activate/`
      );
      return handleResponse(response);
    },

    deactivate: async (id) => {
      const response = await axios.post(
        `${CONFIG.API_BASE_URL}/members/${id}/deactivate/`
      );
      return handleResponse(response);
    },
  },

  // 借閱相關 API
  borrowings: {
    getAll: async () => {
      const response = await axios.get(`${CONFIG.API_BASE_URL}/borrowings/`);
      return handleResponse(response);
    },

    get: async (id) => {
      const response = await axios.get(
        `${CONFIG.API_BASE_URL}/borrowings/${id}/`
      );
      return handleResponse(response);
    },

    create: async (data) => {
      const response = await axios.post(
        `${CONFIG.API_BASE_URL}/borrowings/`,
        data
      );
      return handleResponse(response);
    },

    update: async (id, data) => {
      const response = await axios.put(
        `${CONFIG.API_BASE_URL}/borrowings/${id}/`,
        data
      );
      return handleResponse(response);
    },

    return: async (id) => {
      const response = await axios.post(
        `${CONFIG.API_BASE_URL}/borrowings/${id}/return/`
      );
      return handleResponse(response);
    },

    getOverdue: async () => {
      const response = await axios.get(
        `${CONFIG.API_BASE_URL}/borrowings/overdue/`
      );
      return handleResponse(response);
    },
  },

  // 統計資料 API
  statistics: {
    getDashboard: async () => {
      const response = await axios.get(
        `${CONFIG.API_BASE_URL}/statistics/dashboard/`
      );
      return handleResponse(response);
    },

    getBorrowingTrends: async () => {
      const response = await axios.get(
        `${CONFIG.API_BASE_URL}/statistics/borrowing-trends/`
      );
      return handleResponse(response);
    },

    getPopularBooks: async () => {
      const response = await axios.get(
        `${CONFIG.API_BASE_URL}/statistics/popular-books/`
      );
      return handleResponse(response);
    },
  },

  // 錯誤處理
  setErrorHandler: (handler) => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        handler(error);
        return Promise.reject(error);
      }
    );
  },

  // 設置請求頭（如 JWT token）
  setAuthToken: (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  },
};

// 設置全局 axios 配置
axios.defaults.baseURL = CONFIG.API_BASE_URL;
axios.defaults.timeout = 10000; // 10 秒超時
axios.defaults.headers.common["Content-Type"] = "application/json";

export default API;
