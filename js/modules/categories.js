// categories.js

import { CONFIG } from "../config.js";
import { API } from "../api.js";
import { utils } from "../utils.js";

const CategoryModule = {
  // 載入所有分類
  loadCategories: async () => {
    try {
      const response = await API.categories.getAll();
      CategoryModule.renderCategories(response.data);
    } catch (error) {
      utils.showError("載入分類失敗");
      console.error("Error loading categories:", error);
    }
  },

  // 渲染分類列表
  renderCategories: (categories) => {
    const categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = `
           <table class="min-w-full">
               <thead class="bg-gray-50">
                   <tr>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分類名稱</th>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">書籍數量</th>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                   </tr>
               </thead>
               <tbody class="bg-white divide-y divide-gray-200">
                   ${categories
                     .map(
                       (category) => `
                       <tr>
                           <td class="px-6 py-4 whitespace-nowrap">${
                             category.name
                           }</td>
                           <td class="px-6 py-4">${
                             category.description || "-"
                           }</td>
                           <td class="px-6 py-4 whitespace-nowrap">${
                             category.book_count || 0
                           }</td>
                           <td class="px-6 py-4 whitespace-nowrap space-x-2">
                               <button onclick="CategoryModule.editCategory(${
                                 category.id
                               })" 
                                       class="text-blue-600 hover:text-blue-900">編輯</button>
                               <button onclick="CategoryModule.deleteCategory(${
                                 category.id
                               })" 
                                       class="text-red-600 hover:text-red-900">刪除</button>
                           </td>
                       </tr>
                   `
                     )
                     .join("")}
               </tbody>
           </table>
       `;
  },

  // 開啟新增分類表單
  openCreateForm: () => {
    document.getElementById("modalTitle").textContent = "新增分類";
    CategoryModule.renderCategoryForm();
    document.getElementById("modal").classList.remove("hidden");
  },

  // 渲染分類表單
  renderCategoryForm: (category = null) => {
    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = `
           <form id="categoryForm" class="space-y-4">
               <div>
                   <label class="block text-sm font-medium mb-1">分類名稱</label>
                   <input type="text" id="name" name="name" required
                          value="${category ? category.name : ""}"
                          class="w-full border rounded px-3 py-2">
               </div>
               <div>
                   <label class="block text-sm font-medium mb-1">描述</label>
                   <textarea id="description" name="description" rows="3"
                             class="w-full border rounded px-3 py-2">${
                               category ? category.description : ""
                             }</textarea>
               </div>
               <div class="flex justify-end space-x-2">
                   <button type="button" onclick="CategoryModule.closeModal()" 
                           class="px-4 py-2 bg-gray-200 rounded">取消</button>
                   <button type="submit" 
                           class="px-4 py-2 bg-blue-500 text-white rounded">儲存</button>
               </div>
           </form>
       `;

    CategoryModule.setupFormSubmission(category?.id);
  },

  // 設置表單提交處理
  setupFormSubmission: (categoryId = null) => {
    document.getElementById("categoryForm").onsubmit = async (e) => {
      e.preventDefault();
      const formData = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
      };

      try {
        if (categoryId) {
          // 更新分類
          await API.categories.update(categoryId, formData);
          utils.showSuccess("更新成功");
        } else {
          // 新增分類
          await API.categories.create(formData);
          utils.showSuccess("新增成功");
        }
        CategoryModule.closeModal();
        CategoryModule.loadCategories();
      } catch (error) {
        utils.showError(categoryId ? "更新失敗" : "新增失敗");
        console.error("Error saving category:", error);
      }
    };
  },

  // 編輯分類
  editCategory: async (id) => {
    try {
      const response = await API.categories.get(id);
      document.getElementById("modalTitle").textContent = "編輯分類";
      CategoryModule.renderCategoryForm(response.data);
      document.getElementById("modal").classList.remove("hidden");
    } catch (error) {
      utils.showError("載入分類資料失敗");
      console.error("Error loading category:", error);
    }
  },

  // 刪除分類
  deleteCategory: async (id) => {
    if (confirm("確定要刪除這個分類嗎？刪除後無法復原。")) {
      try {
        await API.categories.delete(id);
        utils.showSuccess("刪除成功");
        CategoryModule.loadCategories();
      } catch (error) {
        utils.showError("刪除失敗");
        console.error("Error deleting category:", error);
      }
    }
  },

  // 關閉 Modal
  closeModal: () => {
    document.getElementById("modal").classList.add("hidden");
  },

  // 初始化
  init: () => {
    CategoryModule.loadCategories();

    // 添加新增按鈕的事件監聽
    const addButton = document.getElementById("addCategoryButton");
    if (addButton) {
      addButton.addEventListener("click", CategoryModule.openCreateForm);
    }
  },
};

// 導出模組
export default CategoryModule;
