// books.js

// 引入所需的配置和工具
import { CONFIG } from "../config.js";
import { API } from "../api.js";
import { utils } from "../utils.js";

const BookModule = {
  // 載入所有書籍
  loadBooks: async () => {
    try {
      const response = await API.books.getAll();
      BookModule.renderBooks(response.data);
    } catch (error) {
      utils.showError("載入書籍失敗");
      console.error("Error loading books:", error);
    }
  },

  // 渲染書籍列表
  renderBooks: (books) => {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = books
      .map(
        (book) => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">${book.title}</td>
                <td class="px-6 py-4 whitespace-nowrap">${book.author}</td>
                <td class="px-6 py-4 whitespace-nowrap">${book.isbn}</td>
                <td class="px-6 py-4 whitespace-nowrap">${utils.formatDate(
                  book.publication_date
                )}</td>
                <td class="px-6 py-4 whitespace-nowrap">${
                  CONFIG.STATUS_MAPPING[book.status]
                }</td>
                <td class="px-6 py-4 whitespace-nowrap space-x-2">
                    <button onclick="BookModule.editBook(${book.id})" 
                            class="text-blue-600 hover:text-blue-900">編輯</button>
                    <button onclick="BookModule.deleteBook(${book.id})" 
                            class="text-red-600 hover:text-red-900">刪除</button>
                </td>
            </tr>
        `
      )
      .join("");
  },

  // 開啟新增書籍表單
  openCreateForm: () => {
    document.getElementById("modalTitle").textContent = "新增書籍";
    document.getElementById("bookForm").reset();
    document.getElementById("modal").classList.remove("hidden");
  },

  // 開啟編輯書籍表單
  editBook: async (id) => {
    try {
      const response = await API.books.get(id);
      const book = response.data;

      document.getElementById("modalTitle").textContent = "編輯書籍";
      BookModule.fillFormData(book);
      document.getElementById("modal").classList.remove("hidden");
      BookModule.currentBookId = id;
    } catch (error) {
      utils.showError("載入書籍資料失敗");
      console.error("Error loading book:", error);
    }
  },

  // 刪除書籍
  deleteBook: async (id) => {
    if (confirm("確定要刪除這本書嗎？")) {
      try {
        await API.books.delete(id);
        utils.showSuccess("刪除成功");
        BookModule.loadBooks();
      } catch (error) {
        utils.showError("刪除失敗");
        console.error("Error deleting book:", error);
      }
    }
  },

  // 填充表單資料
  fillFormData: (book) => {
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("isbn").value = book.isbn;
    document.getElementById("publication_date").value = book.publication_date;
    document.getElementById("status").value = book.status;
  },

  // 取得表單資料
  getFormData: () => {
    return {
      title: document.getElementById("title").value,
      author: document.getElementById("author").value,
      isbn: document.getElementById("isbn").value,
      publication_date: document.getElementById("publication_date").value,
      status: document.getElementById("status").value,
    };
  },

  // 設置表單提交處理
  setupFormSubmission: () => {
    document.getElementById("bookForm").onsubmit = async (e) => {
      e.preventDefault();
      const formData = BookModule.getFormData();

      try {
        if (BookModule.currentBookId) {
          // 更新書籍
          await API.books.update(BookModule.currentBookId, formData);
          utils.showSuccess("更新成功");
        } else {
          // 新增書籍
          await API.books.create(formData);
          utils.showSuccess("新增成功");
        }
        BookModule.closeModal();
        BookModule.loadBooks();
      } catch (error) {
        utils.showError("儲存失敗");
        console.error("Error saving book:", error);
      }
    };
  },

  // 關閉 Modal
  closeModal: () => {
    document.getElementById("modal").classList.add("hidden");
    BookModule.currentBookId = null;
    document.getElementById("bookForm").reset();
  },

  // 初始化
  init: () => {
    BookModule.setupFormSubmission();
    BookModule.loadBooks();
  },

  // 當前編輯的書籍ID
  currentBookId: null,
};

// 導出模組
export default BookModule;
