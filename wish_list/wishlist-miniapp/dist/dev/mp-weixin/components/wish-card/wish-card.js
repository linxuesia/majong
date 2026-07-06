"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "wish-card",
  props: {
    item: {}
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function formatPrice(price) {
      if (price >= 1e4) {
        return (price / 1e4).toFixed(1) + "w";
      }
      return price.toFixed(0);
    }
    function handleClick() {
      emit("click", props.item);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.item.imageUrl || "/static/empty.png",
        b: common_vendor.t(_ctx.item.title),
        c: _ctx.item.price > 0
      }, _ctx.item.price > 0 ? {
        d: common_vendor.t(formatPrice(_ctx.item.price))
      } : {}, {
        e: _ctx.item.claimedByName
      }, _ctx.item.claimedByName ? {
        f: common_vendor.t(_ctx.item.claimedByName)
      } : {}, {
        g: _ctx.item.status === "claimed"
      }, _ctx.item.status === "claimed" ? {} : _ctx.item.status === "completed" ? {} : {}, {
        h: _ctx.item.status === "completed",
        i: _ctx.item.priority === "high"
      }, _ctx.item.priority === "high" ? {} : {}, {
        j: common_vendor.o(handleClick)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-495bc0dc"]]);
wx.createComponent(Component);
