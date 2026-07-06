"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("../common/vendor.js");
const utils_mock = require("./mock.js");
function wxLogin() {
  return new Promise((resolve, reject) => {
    {
      setTimeout(async () => {
        try {
          const res = await utils_mock.mockCallFunction({
            name: "wish-login",
            data: { code: "mock_code" }
          });
          const result = res;
          if (result.code === 0) {
            common_vendor.index.setStorageSync("token", result.data.token);
            common_vendor.index.setStorageSync("userInfo", result.data.userInfo);
            resolve(result.data);
          } else {
            reject(new Error(result.message || "登录失败"));
          }
        } catch (e) {
          reject(e);
        }
      }, 500);
      return;
    }
  });
}
function getUserProfile() {
  return new Promise((resolve, reject) => {
    {
      setTimeout(() => {
        resolve({
          nickName: "心愿达人",
          avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0"
        });
      }, 300);
      return;
    }
  });
}
async function updateUserInfo(info) {
  const token = common_vendor.index.getStorageSync("token");
  if (!token) {
    throw new Error("未登录");
  }
  {
    const res2 = await utils_mock.mockCallFunction({
      name: "wish-login",
      data: {
        action: "updateUserInfo",
        token,
        ...info
      }
    });
    const result2 = res2;
    if (result2.code === 0) {
      common_vendor.index.setStorageSync("userInfo", result2.data);
      return result2.data;
    } else {
      throw new Error(result2.message || "更新用户信息失败");
    }
  }
}
function getToken() {
  return common_vendor.index.getStorageSync("token") || "";
}
function setToken(token) {
  common_vendor.index.setStorageSync("token", token);
}
function removeToken() {
  common_vendor.index.removeStorageSync("token");
  common_vendor.index.removeStorageSync("userInfo");
}
function getLocalUserInfo() {
  const info = common_vendor.index.getStorageSync("userInfo");
  return info || null;
}
function isLoggedIn() {
  return !!common_vendor.index.getStorageSync("token");
}
exports.getLocalUserInfo = getLocalUserInfo;
exports.getToken = getToken;
exports.getUserProfile = getUserProfile;
exports.isLoggedIn = isLoggedIn;
exports.removeToken = removeToken;
exports.setToken = setToken;
exports.updateUserInfo = updateUserInfo;
exports.wxLogin = wxLogin;
