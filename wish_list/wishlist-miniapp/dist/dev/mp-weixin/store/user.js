"use strict";
const common_vendor = require("../common/vendor.js");
const utils_auth = require("../utils/auth.js");
const utils_mock = require("../utils/mock.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const userInfo = common_vendor.ref(utils_auth.getLocalUserInfo());
  const token = common_vendor.ref(common_vendor.index.getStorageSync("token") || "");
  const isLoggedIn = common_vendor.ref(!!token.value);
  async function login() {
    try {
      common_vendor.index.showLoading({ title: "登录中...", mask: true });
      const result = await utils_auth.wxLogin();
      token.value = result.token;
      userInfo.value = result.userInfo;
      isLoggedIn.value = true;
      try {
        const profile = await utils_auth.getUserProfile();
        await utils_auth.updateUserInfo(profile);
        userInfo.value = {
          ...userInfo.value,
          nickName: profile.nickName,
          avatarUrl: profile.avatarUrl
        };
      } catch {
        console.log("用户拒绝授权获取详细信息");
      }
      common_vendor.index.hideLoading();
      return result;
    } catch (e) {
      common_vendor.index.hideLoading();
      common_vendor.index.showToast({
        title: "登录失败，请重试",
        icon: "none"
      });
      throw e;
    }
  }
  async function fetchUserInfo() {
    try {
      if (utils_mock.isMockMode()) {
        const res2 = await utils_mock.mockCallFunction({
          name: "wish-login",
          data: {
            action: "getUserInfo",
            token: token.value
          }
        });
        if (res2.code === 0) {
          userInfo.value = res2.data;
          common_vendor.index.setStorageSync("userInfo", res2.data);
        }
        return;
      }
      const res = await common_vendor.nr.callFunction({
        name: "wish-login",
        data: {
          action: "getUserInfo",
          token: token.value
        }
      });
      const result = res.result;
      if (result.code === 0) {
        userInfo.value = result.data;
        common_vendor.index.setStorageSync("userInfo", result.data);
      }
    } catch (e) {
      console.error("获取用户信息失败", e);
    }
  }
  function logout() {
    token.value = "";
    userInfo.value = null;
    isLoggedIn.value = false;
    utils_auth.removeToken();
    common_vendor.index.showToast({
      title: "已退出登录",
      icon: "none"
    });
  }
  function checkLogin() {
    if (!isLoggedIn.value || !token.value) {
      common_vendor.index.showModal({
        title: "提示",
        content: "请先登录",
        confirmText: "去登录",
        success: (res) => {
          if (res.confirm) {
            login();
          }
        }
      });
      return false;
    }
    return true;
  }
  return {
    userInfo,
    token,
    isLoggedIn,
    login,
    logout,
    fetchUserInfo,
    checkLogin
  };
});
exports.useUserStore = useUserStore;
