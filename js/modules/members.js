// members.js

import { CONFIG } from "../config.js";
import { API } from "../api.js";
import { utils } from "../utils.js";

const MemberModule = {
  // 載入所有會員
  loadMembers: async () => {
    try {
      const response = await API.members.getAll();
      MemberModule.renderMembers(response.data);
    } catch (error) {
      utils.showError("載入會員資料失敗");
      console.error("Error loading members:", error);
    }
  },

  // 渲染會員列表
  renderMembers: (members) => {
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = `
           <table class="min-w-full">
               <thead class="bg-gray-50">
                   <tr>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">會員編號</th>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">電話</th>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">加入日期</th>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                   </tr>
               </thead>
               <tbody class="bg-white divide-y divide-gray-200">
                   ${members
                     .map(
                       (member) => `
                       <tr>
                           <td class="px-6 py-4 whitespace-nowrap">${
                             member.member_id
                           }</td>
                           <td class="px-6 py-4 whitespace-nowrap">${
                             member.name
                           }</td>
                           <td class="px-6 py-4 whitespace-nowrap">${
                             member.phone
                           }</td>
                           <td class="px-6 py-4 whitespace-nowrap">${
                             member.email
                           }</td>
                           <td class="px-6 py-4 whitespace-nowrap">${utils.formatDate(
                             member.join_date
                           )}</td>
                           <td class="px-6 py-4 whitespace-nowrap">
                               ${MemberModule.getStatusBadge(member.status)}
                           </td>
                           <td class="px-6 py-4 whitespace-nowrap space-x-2">
                               <button onclick="MemberModule.editMember(${
                                 member.id
                               })" 
                                       class="text-blue-600 hover:text-blue-900">編輯</button>
                               <button onclick="MemberModule.viewBorrowHistory(${
                                 member.id
                               })" 
                                       class="text-green-600 hover:text-green-900">借閱紀錄</button>
                               ${
                                 member.status === "active"
                                   ? `<button onclick="MemberModule.deactivateMember(${member.id})" 
                                           class="text-red-600 hover:text-red-900">停用</button>`
                                   : `<button onclick="MemberModule.activateMember(${member.id})" 
                                           class="text-green-600 hover:text-green-900">啟用</button>`
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

  // 根據狀態取得對應的標籤樣式
  getStatusBadge: (status) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      suspended: "bg-yellow-100 text-yellow-800",
    };
    const statusText = {
      active: "使用中",
      inactive: "已停用",
      suspended: "暫停使用",
    };
    return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}">
                   ${statusText[status]}
               </span>`;
  },

  // 開啟新增會員表單
  openCreateForm: () => {
    document.getElementById("modalTitle").textContent = "新增會員";
    MemberModule.renderMemberForm();
    document.getElementById("modal").classList.remove("hidden");
  },

  // 渲染會員表單
  renderMemberForm: (member = null) => {
    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = `
           <form id="memberForm" class="space-y-4">
               <div>
                   <label class="block text-sm font-medium mb-1">姓名</label>
                   <input type="text" id="name" name="name" required
                          value="${member ? member.name : ""}"
                          class="w-full border rounded px-3 py-2">
               </div>
               <div>
                   <label class="block text-sm font-medium mb-1">電話</label>
                   <input type="tel" id="phone" name="phone" required
                          value="${member ? member.phone : ""}"
                          class="w-full border rounded px-3 py-2">
               </div>
               <div>
                   <label class="block text-sm font-medium mb-1">Email</label>
                   <input type="email" id="email" name="email" required
                          value="${member ? member.email : ""}"
                          class="w-full border rounded px-3 py-2">
               </div>
               <div>
                   <label class="block text-sm font-medium mb-1">地址</label>
                   <textarea id="address" name="address" rows="2"
                             class="w-full border rounded px-3 py-2">${
                               member ? member.address : ""
                             }</textarea>
               </div>
               ${
                 member
                   ? `
                   <div>
                       <label class="block text-sm font-medium mb-1">狀態</label>
                       <select id="status" name="status" required
                               class="w-full border rounded px-3 py-2">
                           <option value="active" ${
                             member.status === "active" ? "selected" : ""
                           }>使用中</option>
                           <option value="inactive" ${
                             member.status === "inactive" ? "selected" : ""
                           }>已停用</option>
                           <option value="suspended" ${
                             member.status === "suspended" ? "selected" : ""
                           }>暫停使用</option>
                       </select>
                   </div>
               `
                   : ""
               }
               <div class="flex justify-end space-x-2">
                   <button type="button" onclick="MemberModule.closeModal()" 
                           class="px-4 py-2 bg-gray-200 rounded">取消</button>
                   <button type="submit" 
                           class="px-4 py-2 bg-blue-500 text-white rounded">儲存</button>
               </div>
           </form>
       `;

    MemberModule.setupFormSubmission(member?.id);
  },

  // 設置表單提交處理
  setupFormSubmission: (memberId = null) => {
    document.getElementById("memberForm").onsubmit = async (e) => {
      e.preventDefault();
      const formData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
      };

      if (memberId) {
        formData.status = document.getElementById("status").value;
      }

      try {
        if (memberId) {
          await API.members.update(memberId, formData);
          utils.showSuccess("會員資料更新成功");
        } else {
          await API.members.create(formData);
          utils.showSuccess("新會員建立成功");
        }
        MemberModule.closeModal();
        MemberModule.loadMembers();
      } catch (error) {
        utils.showError(memberId ? "更新失敗" : "建立失敗");
        console.error("Error saving member:", error);
      }
    };
  },

  // 編輯會員
  editMember: async (id) => {
    try {
      const response = await API.members.get(id);
      document.getElementById("modalTitle").textContent = "編輯會員資料";
      MemberModule.renderMemberForm(response.data);
      document.getElementById("modal").classList.remove("hidden");
    } catch (error) {
      utils.showError("載入會員資料失敗");
      console.error("Error loading member:", error);
    }
  },

  // 查看借閱歷史
  viewBorrowHistory: async (id) => {
    try {
      const response = await API.members.getBorrowHistory(id);
      MemberModule.renderBorrowHistory(response.data);
      document.getElementById("modal").classList.remove("hidden");
    } catch (error) {
      utils.showError("載入借閱紀錄失敗");
      console.error("Error loading borrow history:", error);
    }
  },

  // 渲染借閱歷史
  renderBorrowHistory: (history) => {
    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = `
           <h3 class="text-lg font-medium mb-4">借閱紀錄</h3>
           <div class="max-h-96 overflow-y-auto">
               <table class="min-w-full">
                   <thead class="bg-gray-50">
                       <tr>
                           <th class="px-4 py-2 text-left">書名</th>
                           <th class="px-4 py-2 text-left">借出日期</th>
                           <th class="px-4 py-2 text-left">歸還日期</th>
                       </tr>
                   </thead>
                   <tbody>
                       ${history
                         .map(
                           (record) => `
                           <tr>
                               <td class="px-4 py-2">${record.book_title}</td>
                               <td class="px-4 py-2">${utils.formatDate(
                                 record.borrow_date
                               )}</td>
                               <td class="px-4 py-2">${
                                 record.return_date
                                   ? utils.formatDate(record.return_date)
                                   : "未歸還"
                               }</td>
                           </tr>
                       `
                         )
                         .join("")}
                   </tbody>
               </table>
           </div>
           <div class="mt-4 flex justify-end">
               <button onclick="MemberModule.closeModal()" 
                       class="px-4 py-2 bg-gray-200 rounded">關閉</button>
           </div>
       `;
  },

  // 停用會員
  deactivateMember: async (id) => {
    if (confirm("確定要停用此會員嗎？")) {
      try {
        await API.members.update(id, { status: "inactive" });
        utils.showSuccess("會員已停用");
        MemberModule.loadMembers();
      } catch (error) {
        utils.showError("停用失敗");
        console.error("Error deactivating member:", error);
      }
    }
  },

  // 啟用會員
  activateMember: async (id) => {
    try {
      await API.members.update(id, { status: "active" });
      utils.showSuccess("會員已啟用");
      MemberModule.loadMembers();
    } catch (error) {
      utils.showError("啟用失敗");
      console.error("Error activating member:", error);
    }
  },

  // 關閉 Modal
  closeModal: () => {
    document.getElementById("modal").classList.add("hidden");
  },

  // 初始化
  init: () => {
    MemberModule.loadMembers();

    // 添加新增按鈕的事件監聽
    const addButton = document.getElementById("addMemberButton");
    if (addButton) {
      addButton.addEventListener("click", MemberModule.openCreateForm);
    }
  },
};

// 導出模組
export default MemberModule;
