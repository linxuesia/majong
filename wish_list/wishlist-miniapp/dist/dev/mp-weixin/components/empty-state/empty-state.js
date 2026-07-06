"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "empty-state",
  props: {
    title: {},
    description: {},
    image: {},
    actionText: {}
  },
  emits: ["action"],
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.image || "/static/empty.png",
        b: common_vendor.t(_ctx.title),
        c: _ctx.description
      }, _ctx.description ? {
        d: common_vendor.t(_ctx.description)
      } : {}, {
        e: _ctx.actionText
      }, _ctx.actionText ? {
        f: common_vendor.t(_ctx.actionText),
        g: common_vendor.o(($event) => _ctx.$emit("action"))
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a83f7a80"]]);
wx.createComponent(Component);
