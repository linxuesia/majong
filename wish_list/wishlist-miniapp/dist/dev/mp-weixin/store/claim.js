"use strict";
const common_vendor = require("../common/vendor.js");
const utils_mock = require("../utils/mock.js");
const useClaimStore = common_vendor.defineStore("claim", () => {
  const myClaims = common_vendor.ref([]);
  const receivedClaims = common_vendor.ref([]);
  const loading = common_vendor.ref(false);
  async function claimWish(wishId) {
    try {
      common_vendor.index.showLoading({ title: "认领中...", mask: true });
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "claim-ops",
          data: {
            action: "claim",
            wishId
          }
        });
      }
      if (result.code === 0) {
        common_vendor.index.showToast({
          title: "认领成功",
          icon: "success"
        });
        return result.data;
      } else {
        throw new Error(result.message || "认领失败");
      }
    } catch (e) {
      common_vendor.index.showToast({
        title: "认领失败，请重试",
        icon: "none"
      });
      throw e;
    } finally {
      common_vendor.index.hideLoading();
    }
  }
  async function cancelClaim(claimId) {
    try {
      common_vendor.index.showLoading({ title: "取消中...", mask: true });
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "claim-ops",
          data: {
            action: "cancel",
            claimId
          }
        });
      }
      if (result.code === 0) {
        myClaims.value = myClaims.value.filter((c) => c._id !== claimId);
        common_vendor.index.showToast({
          title: "已取消认领",
          icon: "success"
        });
      } else {
        throw new Error(result.message || "取消认领失败");
      }
    } catch (e) {
      common_vendor.index.showToast({
        title: "操作失败，请重试",
        icon: "none"
      });
      throw e;
    } finally {
      common_vendor.index.hideLoading();
    }
  }
  async function fetchMyClaims() {
    if (loading.value) return;
    loading.value = true;
    try {
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "claim-ops",
          data: {
            action: "getMyClaims"
          }
        });
      }
      if (result.code === 0) {
        myClaims.value = result.data || [];
      }
    } catch (e) {
      console.error("获取认领列表失败", e);
    } finally {
      loading.value = false;
    }
  }
  async function fetchReceivedClaims() {
    try {
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "claim-ops",
          data: {
            action: "getReceivedClaims"
          }
        });
      }
      if (result.code === 0) {
        receivedClaims.value = result.data || [];
      }
    } catch (e) {
      console.error("获取收到的认领失败", e);
    }
  }
  async function completeClaim(claimId) {
    try {
      common_vendor.index.showLoading({ title: "确认中...", mask: true });
      let result;
      if (utils_mock.isMockMode()) {
        result = await utils_mock.mockCallFunction({
          name: "claim-ops",
          data: {
            action: "complete",
            claimId
          }
        });
      }
      if (result.code === 0) {
        receivedClaims.value = receivedClaims.value.map(
          (c) => c._id === claimId ? { ...c, status: "completed" } : c
        );
        common_vendor.index.showToast({
          title: "已确认收到",
          icon: "success"
        });
      } else {
        throw new Error(result.message || "确认失败");
      }
    } catch (e) {
      common_vendor.index.showToast({
        title: "操作失败",
        icon: "none"
      });
      throw e;
    } finally {
      common_vendor.index.hideLoading();
    }
  }
  return {
    myClaims,
    receivedClaims,
    loading,
    claimWish,
    cancelClaim,
    fetchMyClaims,
    fetchReceivedClaims,
    completeClaim
  };
});
exports.useClaimStore = useClaimStore;
