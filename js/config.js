// config.js

const CONFIG = {
  // API 基礎設定
  API_BASE_URL: "http://localhost:8000/api",
  API_TIMEOUT: 10000, // 10 秒超時

  // 分頁設定
  PAGE_SIZE: 10,

  // 狀態映射
  STATUS_MAPPING: {
    // 書籍狀態
    BOOK_STATUS: {
      available: "可借閱",
      borrowed: "已借出",
      maintenance: "維護中",
      reserved: "已預約",
    },

    // 會員狀態
    MEMBER_STATUS: {
      active: "使用中",
      inactive: "已停用",
      suspended: "暫停使用",
    },

    // 借閱狀態
    BORROWING_STATUS: {
      ongoing: "借閱中",
      overdue: "逾期",
      returned: "已歸還",
    },
  },

  // 日期格式設定
  DATE_FORMAT: {
    display: "YYYY-MM-DD",
    input: "YYYY-MM-DD",
    api: "YYYY-MM-DD",
  },

  // 驗證規則
  VALIDATION: {
    // 書籍相關
    BOOK: {
      title: {
        required: true,
        maxLength: 100,
      },
      isbn: {
        required: true,
        pattern: /^\d{13}$/,
      },
      maxDescriptionLength: 500,
    },

    // 會員相關
    MEMBER: {
      phone: {
        pattern: /^09\d{8}$/,
      },
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
  },

  // 圖書館規則設定
  LIBRARY_RULES: {
    maxBorrowDays: 14,
    maxBooksPerMember: 5,
    overdueFinePerDay: 5,
  },

  // UI 相關設定
  UI: {
    // 表格每頁顯示選項
    tablePageSizes: [10, 20, 50, 100],

    // 顏色主題
    colors: {
      primary: "#3B82F6", // 藍色
      success: "#10B981", // 綠色
      warning: "#F59E0B", // 黃色
      danger: "#EF4444", // 紅色
      info: "#6B7280", // 灰色
    },

    // 消息提示持續時間（毫秒）
    messageTimeout: 3000,
  },

  // 開發相關設定
  DEV: {
    enableLogging: true,
    logLevel: "debug", // 'debug', 'info', 'warn', 'error'
  },
};

// 根據環境設定不同的配置
if (process.env.NODE_ENV === "production") {
  CONFIG.API_BASE_URL = "https://api.yourdomain.com/api";
  CONFIG.DEV.enableLogging = false;
  CONFIG.DEV.logLevel = "error";
}

// 防止配置被修改
Object.freeze(CONFIG);

export default CONFIG;
