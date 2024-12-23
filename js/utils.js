// utils.js

const utils = {
  // 日期格式化
  formatDate: (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  },

  // 時間格式化
  formatDateTime: (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return "-";
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  },

  // 錯誤提示
  showError: (message) => {
    alert(message); // 簡單的錯誤提示，可以替換成更漂亮的提示框
    console.error(message);
  },

  // 成功提示
  showSuccess: (message) => {
    alert(message); // 簡單的成功提示，可以替換成更漂亮的提示框
  },

  // 確認對話框
  confirm: (message) => {
    return window.confirm(message);
  },

  // 表單驗證
  validation: {
    // 必填欄位驗證
    required: (value) => {
      return value !== null && value !== undefined && value.trim() !== "";
    },

    // Email 驗證
    email: (email) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(email);
    },

    // 電話號碼驗證（台灣格式）
    phone: (phone) => {
      const pattern = /^09\d{8}$/;
      return pattern.test(phone);
    },

    // ISBN 驗證（13碼）
    isbn: (isbn) => {
      const pattern = /^\d{13}$/;
      return pattern.test(isbn);
    },
  },

  // 資料處理
  data: {
    // 移除空白
    trim: (str) => {
      return str ? str.trim() : "";
    },

    // 縮短文字
    truncate: (str, length = 50) => {
      if (!str) return "";
      return str.length > length ? str.substring(0, length) + "..." : str;
    },

    // 格式化金額
    formatMoney: (amount) => {
      return new Intl.NumberFormat("zh-TW", {
        style: "currency",
        currency: "TWD",
      }).format(amount);
    },

    // 過濾 XSS
    escapeHtml: (unsafe) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
  },

  // localStorage 操作
  storage: {
    // 儲存資料
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error("Error saving to localStorage", e);
        return false;
      }
    },

    // 讀取資料
    get: (key) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error("Error reading from localStorage", e);
        return null;
      }
    },

    // 移除資料
    remove: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error("Error removing from localStorage", e);
        return false;
      }
    },
  },

  // URL 處理
  url: {
    // 取得 URL 參數
    getQueryParam: (param) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    },

    // 建立 URL 參數
    buildQueryString: (params) => {
      return Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join("&");
    },
  },

  // 防抖函數
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // 節流函數
  throttle: (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // 深拷貝
  deepClone: (obj) => {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      console.error("Error in deepClone:", e);
      return null;
    }
  },

  // 日誌
  logger: {
    debug: (message, ...args) => {
      console.log(`[DEBUG] ${message}`, ...args);
    },
    info: (message, ...args) => {
      console.info(`[INFO] ${message}`, ...args);
    },
    warn: (message, ...args) => {
      console.warn(`[WARN] ${message}`, ...args);
    },
    error: (message, ...args) => {
      console.error(`[ERROR] ${message}`, ...args);
    },
  },
};

export default utils;
