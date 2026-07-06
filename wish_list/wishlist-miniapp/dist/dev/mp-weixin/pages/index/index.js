"use strict";
const common_vendor = require("../../common/vendor.js");
const store_wish = require("../../store/wish.js");
const store_user = require("../../store/user.js");
const store_friend = require("../../store/friend.js");
if (!Array) {
  const _easycom_wish_card2 = common_vendor.resolveComponent("wish-card");
  const _easycom_empty_state2 = common_vendor.resolveComponent("empty-state");
  (_easycom_wish_card2 + _easycom_empty_state2)();
}
const _easycom_wish_card = () => "../../components/wish-card/wish-card.js";
const _easycom_empty_state = () => "../../components/empty-state/empty-state.js";
if (!Math) {
  (_easycom_wish_card + _easycom_empty_state)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const wishStore = store_wish.useWishStore();
    const userStore = store_user.useUserStore();
    const friendStore = store_friend.useFriendStore();
    const totalCount = common_vendor.computed(() => wishStore.items.length);
    const claimedCount = common_vendor.computed(() => wishStore.items.filter((i) => i.status === "claimed").length);
    const friendCount = common_vendor.computed(() => friendStore.friends.length);
    const topFriends = common_vendor.computed(() => friendStore.friends.slice(0, 3));
    const leftCol = common_vendor.computed(() => wishStore.items.filter((_, i) => i % 2 === 0));
    const rightCol = common_vendor.computed(() => wishStore.items.filter((_, i) => i % 2 === 1));
    common_vendor.onMounted(() => {
      if (userStore.isLoggedIn) {
        wishStore.fetchMyWishes(true);
        friendStore.fetchFriends();
      }
    });
    common_vendor.onPullDownRefresh(async () => {
      await Promise.all([
        wishStore.fetchMyWishes(true),
        friendStore.fetchFriends()
      ]);
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      wishStore.fetchMyWishes();
    });
    function goToAdd() {
      if (!userStore.checkLogin()) return;
      common_vendor.index.navigateTo({ url: "/pages/add-item/add-item" });
    }
    function goToDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/item-detail/item-detail?id=${item._id}`
      });
    }
    function goToFriends() {
      common_vendor.index.switchTab({ url: "/pages/friends/friends" });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(totalCount.value),
        b: common_vendor.t(claimedCount.value),
        c: common_vendor.f(topFriends.value, (friend, idx, i0) => {
          return {
            a: idx,
            b: idx > 0 ? 1 : "",
            c: friend.friendAvatar || "/static/tab-profile.png"
          };
        }),
        d: common_vendor.t(friendCount.value),
        e: common_vendor.o(goToFriends),
        f: common_vendor.unref(wishStore).items.length > 0
      }, common_vendor.unref(wishStore).items.length > 0 ? {
        g: common_vendor.f(leftCol.value, (item, k0, i0) => {
          return {
            a: item._id,
            b: common_vendor.o(goToDetail, item._id),
            c: "83a5a03c-0-" + i0,
            d: common_vendor.p({
              item
            })
          };
        }),
        h: common_vendor.f(rightCol.value, (item, k0, i0) => {
          return {
            a: item._id,
            b: common_vendor.o(goToDetail, item._id),
            c: "83a5a03c-1-" + i0,
            d: common_vendor.p({
              item
            })
          };
        })
      } : {}, {
        i: common_vendor.unref(wishStore).loading
      }, common_vendor.unref(wishStore).loading ? {} : !common_vendor.unref(wishStore).hasMore && common_vendor.unref(wishStore).items.length > 0 ? {} : !common_vendor.unref(wishStore).loading ? {
        l: common_vendor.o(goToAdd),
        m: common_vendor.p({
          title: "还没有心愿",
          description: "把你喜欢的东西都丢进来吧",
          ["action-text"]: "添加第一个心愿"
        })
      } : {}, {
        j: !common_vendor.unref(wishStore).hasMore && common_vendor.unref(wishStore).items.length > 0,
        k: !common_vendor.unref(wishStore).loading,
        n: common_vendor.o(goToAdd)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
