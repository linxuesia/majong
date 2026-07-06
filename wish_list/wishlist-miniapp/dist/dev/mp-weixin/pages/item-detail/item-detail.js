"use strict";
const common_vendor = require("../../common/vendor.js");
const store_wish = require("../../store/wish.js");
const store_claim = require("../../store/claim.js");
const store_user = require("../../store/user.js");
if (!Array) {
  const _easycom_claim_button2 = common_vendor.resolveComponent("claim-button");
  _easycom_claim_button2();
}
const _easycom_claim_button = () => "../../components/claim-button/claim-button.js";
if (!Math) {
  _easycom_claim_button();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "item-detail",
  setup(__props) {
    const wishStore = store_wish.useWishStore();
    const claimStore = store_claim.useClaimStore();
    const userStore = store_user.useUserStore();
    const item = common_vendor.ref(null);
    const loading = common_vendor.ref(true);
    const isFriendView = common_vendor.ref(false);
    const isOwner = common_vendor.computed(() => {
      return item.value && userStore.userInfo && item.value.userId === userStore.userInfo._id;
    });
    const statusText = common_vendor.computed(() => {
      if (!item.value) return "";
      const map = {
        active: "待认领",
        claimed: "已认领",
        completed: "已完成",
        cancelled: "已取消"
      };
      return map[item.value.status] || item.value.status;
    });
    const priorityText = common_vendor.computed(() => {
      if (!item.value) return "";
      const map = {
        low: "一般",
        medium: "想要",
        high: "最想要"
      };
      return map[item.value.priority] || "";
    });
    const claimStatus = common_vendor.computed(() => {
      var _a;
      if (!item.value) return "unclaimed";
      if (item.value.status === "completed") return "completed";
      if (item.value.status === "claimed") {
        if (item.value.claimedBy === ((_a = userStore.userInfo) == null ? void 0 : _a._id)) {
          return "claimed-by-me";
        }
        return "claimed-by-other";
      }
      return "unclaimed";
    });
    common_vendor.onLoad((options) => {
      const id = options == null ? void 0 : options.id;
      if (id) {
        loadDetail(id);
      }
      if (options == null ? void 0 : options.friendId) {
        isFriendView.value = true;
      }
    });
    async function loadDetail(id) {
      loading.value = true;
      try {
        const detail = await wishStore.fetchWishDetail(id);
        item.value = detail;
      } catch (e) {
        console.error("加载详情失败", e);
      } finally {
        loading.value = false;
      }
    }
    function formatTime(time) {
      if (!time) return "";
      const date = new Date(time);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    function copyLink() {
      var _a;
      if ((_a = item.value) == null ? void 0 : _a.originalUrl) {
        common_vendor.index.setClipboardData({
          data: item.value.originalUrl,
          success: () => {
            common_vendor.index.showToast({ title: "链接已复制", icon: "success" });
          }
        });
      }
    }
    async function handleClaim(wishId) {
      var _a, _b;
      try {
        await claimStore.claimWish(wishId);
        if (item.value) {
          item.value.status = "claimed";
          item.value.claimedBy = (_a = userStore.userInfo) == null ? void 0 : _a._id;
          item.value.claimedByName = (_b = userStore.userInfo) == null ? void 0 : _b.nickName;
        }
      } catch {
      }
    }
    async function handleCancelClaim(wishId) {
      try {
        const claim = claimStore.myClaims.find((c) => c.wishId === wishId);
        if (claim) {
          await claimStore.cancelClaim(claim._id);
        }
        if (item.value) {
          item.value.status = "active";
          item.value.claimedBy = void 0;
          item.value.claimedByName = void 0;
        }
      } catch {
      }
    }
    function goEdit() {
      if (item.value) {
        common_vendor.index.navigateTo({
          url: `/pages/edit-item/edit-item?id=${item.value._id}`
        });
      }
    }
    function handleDelete() {
      if (!item.value) return;
      common_vendor.index.showModal({
        title: "确认删除",
        content: "删除后不可恢复，确定要删除这个心愿吗？",
        confirmColor: "#FF6B6B",
        success: async (res) => {
          if (res.confirm) {
            try {
              await wishStore.deleteWish(item.value._id);
              common_vendor.index.navigateBack();
            } catch {
            }
          }
        }
      });
    }
    function goBack() {
      common_vendor.index.navigateBack();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {} : item.value ? common_vendor.e({
        c: item.value.imageUrl || "/static/empty.png",
        d: common_vendor.t(item.value.price > 0 ? `¥${item.value.price.toFixed(2)}` : "价格待定"),
        e: common_vendor.t(statusText.value),
        f: common_vendor.n(`detail-page__status-tag--${item.value.status}`),
        g: common_vendor.t(item.value.title),
        h: item.value.description
      }, item.value.description ? {
        i: common_vendor.t(item.value.description)
      } : {}, {
        j: common_vendor.t(item.value.category),
        k: common_vendor.t(priorityText.value),
        l: item.value.originalUrl
      }, item.value.originalUrl ? {
        m: common_vendor.o(copyLink)
      } : {}, {
        n: item.value.status === "claimed" && item.value.claimedByName
      }, item.value.status === "claimed" && item.value.claimedByName ? {
        o: common_vendor.t(item.value.claimedByName)
      } : {}, {
        p: common_vendor.t(formatTime(item.value.createdAt)),
        q: isFriendView.value
      }, isFriendView.value ? {
        r: common_vendor.o(handleClaim),
        s: common_vendor.o(handleCancelClaim),
        t: common_vendor.p({
          status: claimStatus.value,
          ["wish-id"]: item.value._id
        })
      } : {}, {
        v: isOwner.value
      }, isOwner.value ? {
        w: common_vendor.o(goEdit),
        x: common_vendor.o(handleDelete)
      } : {}) : {
        y: common_vendor.o(goBack)
      }, {
        b: item.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c1cbfc61"]]);
wx.createPage(MiniProgramPage);
