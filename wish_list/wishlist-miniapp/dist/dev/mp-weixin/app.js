"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_user = require("./store/user.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/friends/friends.js";
  "./pages/profile/profile.js";
  "./pages/add-item/add-item.js";
  "./pages/item-detail/item-detail.js";
  "./pages/friend-wishlist/friend-wishlist.js";
  "./pages/edit-item/edit-item.js";
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(async () => {
      console.log("App Launch");
      const userStore = store_user.useUserStore();
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        userStore.token = token;
        try {
          await userStore.fetchUserInfo();
        } catch (e) {
          console.error("获取用户信息失败", e);
        }
      }
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
});
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
