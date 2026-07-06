"use strict";
const common_vendor = require("../../common/vendor.js");
const store_wish = require("../../store/wish.js");
if (!Array) {
  const _easycom_price_filter2 = common_vendor.resolveComponent("price-filter");
  const _easycom_wish_card2 = common_vendor.resolveComponent("wish-card");
  const _easycom_empty_state2 = common_vendor.resolveComponent("empty-state");
  (_easycom_price_filter2 + _easycom_wish_card2 + _easycom_empty_state2)();
}
const _easycom_price_filter = () => "../../components/price-filter/price-filter.js";
const _easycom_wish_card = () => "../../components/wish-card/wish-card.js";
const _easycom_empty_state = () => "../../components/empty-state/empty-state.js";
if (!Math) {
  (_easycom_price_filter + _easycom_wish_card + _easycom_empty_state)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "friend-wishlist",
  setup(__props) {
    const wishStore = store_wish.useWishStore();
    const friendId = common_vendor.ref("");
    const friendName = common_vendor.ref("");
    const friendAvatar = common_vendor.ref("");
    const items = common_vendor.ref([]);
    const loading = common_vendor.ref(true);
    const priceFilterRef = common_vendor.ref();
    const leftCol = common_vendor.computed(() => items.value.filter((_, i) => i % 2 === 0));
    const rightCol = common_vendor.computed(() => items.value.filter((_, i) => i % 2 === 1));
    common_vendor.onLoad((options) => {
      friendId.value = (options == null ? void 0 : options.friendId) || "";
      friendName.value = decodeURIComponent((options == null ? void 0 : options.friendName) || "好友");
      friendAvatar.value = decodeURIComponent((options == null ? void 0 : options.friendAvatar) || "");
      common_vendor.index.setNavigationBarTitle({
        title: `${friendName.value}的心愿`
      });
      loadWishes();
    });
    async function loadWishes(priceRange) {
      if (!friendId.value) return;
      loading.value = true;
      try {
        const result = await wishStore.fetchFriendWishes(
          friendId.value,
          true,
          priceRange
        );
        items.value = result;
      } catch (e) {
        console.error("加载好友心愿失败", e);
      } finally {
        loading.value = false;
      }
    }
    function handlePriceChange(range) {
      loadWishes(range);
    }
    function goToDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/item-detail/item-detail?id=${item._id}&friendId=${friendId.value}`
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: friendAvatar.value || "/static/tab-profile.png",
        b: common_vendor.t(friendName.value),
        c: common_vendor.t(items.value.length),
        d: common_vendor.sr(priceFilterRef, "42e57f7d-0", {
          "k": "priceFilterRef"
        }),
        e: common_vendor.o(handlePriceChange),
        f: common_vendor.p({
          ["max-limit"]: 1e4
        }),
        g: items.value.length > 0
      }, items.value.length > 0 ? {
        h: common_vendor.f(leftCol.value, (item, k0, i0) => {
          return {
            a: item._id,
            b: common_vendor.o(goToDetail, item._id),
            c: "42e57f7d-1-" + i0,
            d: common_vendor.p({
              item
            })
          };
        }),
        i: common_vendor.f(rightCol.value, (item, k0, i0) => {
          return {
            a: item._id,
            b: common_vendor.o(goToDetail, item._id),
            c: "42e57f7d-2-" + i0,
            d: common_vendor.p({
              item
            })
          };
        })
      } : !loading.value ? {
        k: common_vendor.p({
          title: "好友还没有心愿",
          description: "等好友添加心愿后，你就可以认领送礼物啦"
        })
      } : {}, {
        j: !loading.value,
        l: loading.value
      }, loading.value ? {} : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-42e57f7d"]]);
wx.createPage(MiniProgramPage);
