// borrowings.js

import { CONFIG } from "../config.js";
import { API } from "../api.js";
import { utils } from "../utils.js";

const BorrowingModule = {
  // 載入所有借閱記錄
  loadBorrowings: async () => {
    try {
      const response = await API.borrowings.getAll();
      BorrowingModule.renderBorrowings(response.data);
    } catch (error) {
      utils.showError("載入借閱記錄失敗");
      console.error("Error loading borrowings:", error);
    }
  },

  // 渲染借閱記錄列表
  renderBorrowings: (borrowings) => {
    const borrowingList = document.getElementById("borrowingList");
    borrowingList.innerHTML = `
            <table class="min-w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">書名</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">借閱者</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">借出日期</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">預計歸還日期</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">實際歸還日期</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${borrowings
                      .map(
                        (borrowing) => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${
                              borrowing.book_title
                            }</td>
                            <td class="px-6 py-4 whitespace-nowrap">${
                              borrowing.member_name
                            }</td>
                            <td class="px-6 py-4 whitespace-nowrap">${utils.formatDate(
                              borrowing.borrow_date
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${utils.formatDate(
                              borrowing.expected_return_date
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${
                              borrowing.return_date
                                ? utils.formatDate(borrowing.return_date)
                                : "-"
                            }</td>
                            <td class="px-6 py-4 whitespace-nowrap">${BorrowingModule.getStatusDisplay(
                              borrowing
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                ${
                                  borrowing.return_date
                                    ? ""
                                    : `
                                    <button onclick="BorrowingModule.returnBook(${borrowing.id})" 
                                            class="text-green-600 hover:text-green-900">
                                        歸還
                                    </button>
                                `
                                }
                            </td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        `;
  },

  // 開啟新增借閱表單
  openCreateForm: async () => {
    try {
      // 獲取可用書籍和會員列表
      const [booksResponse, membersResponse] = await Promise.all([
        API.books.getAll(),
        API.members.getAll(),
      ]);

      // 過濾出可借閱的書籍
      const availableBooks = booksResponse.data.filter(
        (book) => book.status === "available"
      );

      document.getElementById("modalTitle").textContent = "新增借閱";
      BorrowingModule.renderBorrowingForm(availableBooks, membersResponse.data);
      document.getElementById("modal").classList.remove("hidden");
    } catch (error) {
      utils.showError("載入資料失敗");
      console.error("Error loading form data:", error);
    }
  },

  // 渲染借閱表單
  renderBorrowingForm: (books, members) => {
    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = `
            <form id="borrowingForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">選擇書籍</label>
                    <select id="book_id" name="book_id" required
                            class="w-full border rounded px-3 py-2">
                        <option value="">請選擇書籍</option>
                        ${books
                          .map(
                            (book) => `
                            <option value="${book.id}">${book.title}</option>
                        `
                          )
                          .join("")}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">選擇借閱者</label>
                    <select id="member_id" name="member_id" required
                            class="w-full border rounded px-3 py-2">
                        <option value="">請選擇借閱者</option>
                        ${members
                          .map(
                            (member) => `
                            <option value="${member.id}">${member.name}</option>
                        `
                          )
                          .join("")}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">預計歸還日期</label>
                    <input type="date" id="expected_return_date" name="expected_return_date" required
                           class="w-full border rounded px-3 py-2"
                           min="${new Date().toISOString().split("T")[0]}">
                </div>
                <div class="flex justify-end space-x-2">
                    <button type="button" onclick="BorrowingModule.closeModal()" 
                            class="px-4 py-2 bg-gray-200 rounded">
                        取消
                    </button>
                    <button type="submit" 
                            class="px-4 py-2 bg-blue-500 text-white rounded">
                        確認借閱
                    </button>
                </div>
            </form>
        `;

    BorrowingModule.setupFormSubmission();
  },

  // 設置表單提交處理
  setupFormSubmission: () => {
    document.getElementById("borrowingForm").onsubmit = async (e) => {
      e.preventDefault();
      const formData = {
        book_id: document.getElementById("book_id").value,
        member_id: document.getElementById("member_id").value,
        expected_return_date: document.getElementById("expected_return_date")
          .value,
        borrow_date: new Date().toISOString().split("T")[0],
      };

      try {
        await API.borrowings.create(formData);
        utils.showSuccess("借閱成功");
        BorrowingModule.closeModal();
        BorrowingModule.loadBorrowings();
      } catch (error) {
        utils.showError("借閱失敗");
        console.error("Error creating borrowing:", error);
      }
    };
  },

  // 歸還書籍
  returnBook: async (borrowingId) => {
    if (confirm("確定要歸還這本書嗎？")) {
      try {
        await API.borrowings.return(borrowingId);
        utils.showSuccess("歸還成功");
        BorrowingModule.loadBorrowings();
      } catch (error) {
        utils.showError("歸還失敗");
        console.error("Error returning book:", error);
      }
    }
  },

  // 獲取借閱狀態顯示文字
  getStatusDisplay: (borrowing) => {
    if (borrowing.return_date) {
      return "已歸還";
    }
    const expectedDate = new Date(borrowing.expected_return_date);
    const today = new Date();
    return expectedDate < today ? "逾期未還" : "借閱中";
  },

  // 關閉 Modal
  closeModal: () => {
    document.getElementById("modal").classList.add("hidden");
  },

  // 初始化
  init: () => {
    BorrowingModule.loadBorrowings();
  },
};

// 導出模組
export default BorrowingModule;
