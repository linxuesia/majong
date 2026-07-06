"use strict";
const common_vendor = require("../../common/vendor.js");
const store_friend = require("../../store/friend.js");
const store_user = require("../../store/user.js");
if (!Array) {
  const _easycom_empty_state2 = common_vendor.resolveComponent("empty-state");
  _easycom_empty_state2();
}
const _easycom_empty_state = () => "../../components/empty-state/empty-state.js";
if (!Math) {
  _easycom_empty_state();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "friends",
  setup(__props) {
    const friendStore = store_friend.useFriendStore();
    const userStore = store_user.useUserStore();
    const searchKeyword = common_vendor.ref("");
    common_vendor.onMounted(() => {
      if (userStore.isLoggedIn) {
        friendStore.fetchFriends();
      }
    });
    common_vendor.onShow(() => {
      if (userStore.isLoggedIn) {
        friendStore.fetchFriends();
      }
    });
    function handleSearch() {
      if (!searchKeyword.value.trim()) {
        friendStore.fetchFriends();
        return;
      }
      friendStore.searchFriend(searchKeyword.value.trim());
    }
    function goToFriendWishlist(friend) {
      common_vendor.index.navigateTo({
        url: `/pages/friend-wishlist/friend-wishlist?friendId=${friend.friendId}&friendName=${encodeURIComponent(friend.friendName)}&friendAvatar=${encodeURIComponent(friend.friendAvatar || "")}`
      });
    }
    function inviteFriend() {
      common_vendor.index.showModal({
        title: "邀请好友",
        content: "分享小程序给微信好友，即可互相查看心愿清单",
        confirmText: "分享",
        confirmColor: "#FF6B6B",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.shareAppMessage({
              title: "来看看我的心愿清单吧",
              path: "/pages/index/index",
              imageUrl: "/static/tab-home.png"
            });
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: searchKeyword.value,
        c: common_vendor.o(($event) => searchKeyword.value = $event.detail.value),
        d: common_vendor.unref(friendStore).friends.length > 0
      }, common_vendor.unref(friendStore).friends.length > 0 ? {
        e: common_vendor.f(common_vendor.unref(friendStore).friends, (friend, k0, i0) => {
          return {
            a: friend.friendAvatar || "/static/tab-profile.png",
            b: common_vendor.t(friend.friendName),
            c: friend._id,
            d: common_vendor.o(($event) => goToFriendWishlist(friend), friend._id)
          };
        })
      } : !common_vendor.unref(friendStore).loading ? {
        g: common_vendor.p({
          title: "还没有好友",
          description: "分享小程序给好友，一起使用心愿清单吧"
        })
      } : {}, {
        f: !common_vendor.unref(friendStore).loading,
        h: common_vendor.unref(friendStore).loading
      }, common_vendor.unref(friendStore).loading ? {} : {}, {
        i: common_vendor.o(inviteFriend)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a89a5f87"]]);
wx.createPage(MiniProgramPage);
