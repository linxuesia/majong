"use strict";
const common_vendor = require("../common/vendor.js");
const utils_mock = require("../utils/mock.js");
const useFriendStore = common_vendor.defineStore("friend", () => {
  const friends = common_vendor.ref([]);
  const loading = common_vendor.ref(false);
  async function fetchFriends() {
    if (loading.value) return;
    loading.value = true;
    try {
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "friend-ops",
          data: {
            action: "getList"
          }
        });
      }
      if (result.code === 0) {
        friends.value = result.data || [];
      }
    } catch (e) {
      console.error("获取好友列表失败", e);
      common_vendor.index.showToast({
        title: "获取好友列表失败",
        icon: "none"
      });
    } finally {
      loading.value = false;
    }
  }
  async function searchFriend(keyword) {
    try {
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "friend-ops",
          data: {
            action: "search",
            keyword
          }
        });
      }
      if (result.code === 0) {
        return result.data || [];
      }
      return [];
    } catch (e) {
      console.error("搜索好友失败", e);
      return [];
    }
  }
  async function addFriend(friendId) {
    try {
      common_vendor.index.showLoading({ title: "发送中...", mask: true });
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "friend-ops",
          data: {
            action: "add",
            friendId
          }
        });
      }
      if (result.code === 0) {
        common_vendor.index.showToast({
          title: "好友请求已发送",
          icon: "success"
        });
      } else {
        throw new Error(result.message || "添加好友失败");
      }
    } catch (e) {
      common_vendor.index.showToast({
        title: "添加好友失败",
        icon: "none"
      });
      throw e;
    } finally {
      common_vendor.index.hideLoading();
    }
  }
  async function addFriendByShare(inviteCode) {
    try {
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "friend-ops",
          data: {
            action: "addByShare",
            inviteCode
          }
        });
      }
      if (result.code === 0) {
        common_vendor.index.showToast({
          title: "添加好友成功",
          icon: "success"
        });
        await fetchFriends();
        return true;
      } else {
        throw new Error(result.message || "添加好友失败");
      }
    } catch (e) {
      common_vendor.index.showToast({
        title: "添加好友失败",
        icon: "none"
      });
      return false;
    }
  }
  async function removeFriend(friendId) {
    try {
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "friend-ops",
          data: {
            action: "remove",
            friendId
          }
        });
      }
      if (result.code === 0) {
        friends.value = friends.value.filter((f) => f.friendId !== friendId);
        common_vendor.index.showToast({
          title: "已删除好友",
          icon: "success"
        });
      } else {
        throw new Error(result.message || "删除好友失败");
      }
    } catch (e) {
      common_vendor.index.showToast({
        title: "删除好友失败",
        icon: "none"
      });
    }
  }
  return {
    friends,
    loading,
    fetchFriends,
    searchFriend,
    addFriend,
    addFriendByShare,
    removeFriend
  };
});
exports.useFriendStore = useFriendStore;
