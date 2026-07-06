"use strict";
const common_vendor = require("../common/vendor.js");
const utils_mock = require("../utils/mock.js");
const useWishStore = common_vendor.defineStore("wish", () => {
  const items = common_vendor.ref([]);
  const loading = common_vendor.ref(false);
  const hasMore = common_vendor.ref(true);
  const currentPage = common_vendor.ref(1);
  const pageSize = 10;
  async function fetchMyWishes(reset = false) {
    if (loading.value) return;
    if (reset) {
      currentPage.value = 1;
      hasMore.value = true;
      items.value = [];
    }
    if (!hasMore.value) return;
    loading.value = true;
    try {
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "wish-crud",
          data: {
            action: "getList",
            page: currentPage.value,
            pageSize
          }
        });
      }
      if (result.code === 0) {
        const data = result.data;
        if (reset) {
          items.value = data.list;
        } else {
          items.value = [...items.value, ...data.list];
        }
        hasMore.value = data.hasMore;
        currentPage.value++;
      }
    } catch (e) {
      console.error("获取心愿清单失败", e);
      common_vendor.index.showToast({
        title: "获取心愿清单失败",
        icon: "none"
      });
    } finally {
      loading.value = false;
    }
  }
  async function addWish(params) {
    try {
      common_vendor.index.showLoading({ title: "添加中...", mask: true });
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "wish-crud",
          data: {
            action: "add",
            ...params
          }
        });
      }
      if (result.code === 0) {
        const newItem = result.data;
        items.value.unshift(newItem);
        common_vendor.index.showToast({
          title: "添加成功",
          icon: "success"
        });
        return newItem;
      } else {
        throw new Error(result.message || "添加失败");
      }
    } catch (e) {
      common_vendor.index.showToast({
        title: "添加失败，请重试",
        icon: "none"
      });
      throw e;
    } finally {
      common_vendor.index.hideLoading();
    }
  }
  async function updateWish(params) {
    try {
      common_vendor.index.showLoading({ title: "保存中...", mask: true });
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "wish-crud",
          data: {
            action: "update",
            ...params
          }
        });
      }
      if (result.code === 0) {
        const updatedItem = result.data;
        const index = items.value.findIndex((item) => item._id === updatedItem._id);
        if (index !== -1) {
          items.value[index] = updatedItem;
        }
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        return updatedItem;
      } else {
        throw new Error(result.message || "更新失败");
      }
    } catch (e) {
      common_vendor.index.showToast({
        title: "保存失败，请重试",
        icon: "none"
      });
      throw e;
    } finally {
      common_vendor.index.hideLoading();
    }
  }
  async function deleteWish(id) {
    try {
      common_vendor.index.showLoading({ title: "删除中...", mask: true });
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "wish-crud",
          data: {
            action: "delete",
            id
          }
        });
      }
      if (result.code === 0) {
        items.value = items.value.filter((item) => item._id !== id);
        common_vendor.index.showToast({
          title: "已删除",
          icon: "success"
        });
      } else {
        throw new Error(result.message || "删除失败");
      }
    } catch (e) {
      common_vendor.index.showToast({
        title: "删除失败，请重试",
        icon: "none"
      });
      throw e;
    } finally {
      common_vendor.index.hideLoading();
    }
  }
  async function fetchFriendWishes(friendId, reset = false, priceRange) {
    try {
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "wish-crud",
          data: {
            action: "getFriendList",
            friendId,
            page: reset ? 1 : currentPage.value,
            pageSize,
            priceMin: priceRange == null ? void 0 : priceRange.min,
            priceMax: priceRange == null ? void 0 : priceRange.max
          }
        });
      }
      if (result.code === 0) {
        const data = result.data;
        return data.list;
      }
      return [];
    } catch (e) {
      console.error("获取好友心愿清单失败", e);
      return [];
    }
  }
  async function fetchWishDetail(id) {
    try {
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "wish-crud",
          data: {
            action: "getDetail",
            id
          }
        });
      }
      if (result.code === 0) {
        return result.data;
      }
      return null;
    } catch (e) {
      console.error("获取心愿详情失败", e);
      return null;
    }
  }
  return {
    items,
    loading,
    hasMore,
    currentPage,
    fetchMyWishes,
    addWish,
    updateWish,
    deleteWish,
    fetchFriendWishes,
    fetchWishDetail
  };
});
exports.useWishStore = useWishStore;
