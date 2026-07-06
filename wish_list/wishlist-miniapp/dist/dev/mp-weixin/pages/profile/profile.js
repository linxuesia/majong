"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_user = require("../../store/user.js");
const store_wish = require("../../store/wish.js");
const store_claim = require("../../store/claim.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "profile",
  setup(__props) {
    const userStore = store_user.useUserStore();
    const wishStore = store_wish.useWishStore();
    const claimStore = store_claim.useClaimStore();
    common_vendor.onMounted(() => {
      if (userStore.isLoggedIn) {
        wishStore.fetchMyWishes(true);
        claimStore.fetchMyClaims();
        claimStore.fetchReceivedClaims();
      }
    });
    common_vendor.onShow(() => {
      if (userStore.isLoggedIn) {
        claimStore.fetchMyClaims();
        claimStore.fetchReceivedClaims();
      }
    });
    function formatTime(time) {
      if (!time) return "";
      const date = new Date(time);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    async function handleLogin() {
      try {
        await userStore.login();
        wishStore.fetchMyWishes(true);
        claimStore.fetchMyClaims();
        claimStore.fetchReceivedClaims();
      } catch {
      }
    }
    function handleChangeAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempPath = res.tempFilePaths[0];
          common_vendor.index.showLoading({ title: "上传中..." });
          common_vendor.nr.uploadFile({
            filePath: tempPath,
            cloudPath: `avatars/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
            success: async (uploadRes) => {
              var _a;
              try {
                const { updateUserInfo } = await "../../utils/auth.js";
                await updateUserInfo({
                  nickName: ((_a = userStore.userInfo) == null ? void 0 : _a.nickName) || "",
                  avatarUrl: uploadRes.fileID
                });
                if (userStore.userInfo) {
                  userStore.userInfo.avatarUrl = uploadRes.fileID;
                }
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({ title: "头像更新成功", icon: "success" });
              } catch {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({ title: "更新失败", icon: "none" });
              }
            },
            fail: () => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "上传失败", icon: "none" });
            }
          });
        }
      });
    }
    function handleLogout() {
      common_vendor.index.showModal({
        title: "确认退出",
        content: "退出后需要重新登录",
        confirmColor: "#FF6B6B",
        success: (res) => {
          if (res.confirm) {
            userStore.logout();
            wishStore.items = [];
            claimStore.myClaims = [];
            claimStore.receivedClaims = [];
          }
        }
      });
    }
    function goToMyWishes() {
      common_vendor.index.switchTab({ url: "/pages/index/index" });
    }
    function goToMyClaims() {
      common_vendor.index.showToast({ title: "我认领的礼物", icon: "none" });
    }
    function goToReceivedClaims() {
      common_vendor.index.showToast({ title: "收到的认领", icon: "none" });
    }
    function showAbout() {
      common_vendor.index.showModal({
        title: "关于心愿清单",
        content: "心愿清单小程序 v1.0.0\n记录你的心愿，让好友送你最想要的礼物",
        showCancel: false
      });
    }
    function clearCache() {
      common_vendor.index.showModal({
        title: "清除缓存",
        content: "确定要清除本地缓存吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.clearStorageSync();
            common_vendor.index.showToast({ title: "缓存已清除", icon: "success" });
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(userStore).isLoggedIn && common_vendor.unref(userStore).userInfo
      }, common_vendor.unref(userStore).isLoggedIn && common_vendor.unref(userStore).userInfo ? {
        b: common_vendor.unref(userStore).userInfo.avatarUrl || "/static/tab-profile.png",
        c: common_vendor.o(handleChangeAvatar),
        d: common_vendor.t(common_vendor.unref(userStore).userInfo.nickName),
        e: common_vendor.t(formatTime(common_vendor.unref(userStore).userInfo.createdAt))
      } : {
        f: common_assets._imports_0,
        g: common_vendor.o(handleLogin)
      }, {
        h: common_vendor.t(common_vendor.unref(wishStore).items.length),
        i: common_vendor.o(goToMyWishes),
        j: common_vendor.t(common_vendor.unref(claimStore).myClaims.length),
        k: common_vendor.o(goToMyClaims),
        l: common_vendor.t(common_vendor.unref(claimStore).receivedClaims.length),
        m: common_vendor.o(goToReceivedClaims),
        n: common_vendor.o(goToMyClaims),
        o: common_vendor.o(goToReceivedClaims),
        p: common_vendor.o(goToMyWishes),
        q: common_vendor.o(showAbout),
        r: common_vendor.o(clearCache),
        s: common_vendor.unref(userStore).isLoggedIn
      }, common_vendor.unref(userStore).isLoggedIn ? {
        t: common_vendor.o(handleLogout)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-04d37cba"]]);
wx.createPage(MiniProgramPage);
