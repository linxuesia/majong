"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "claim-button",
  props: {
    status: {},
    wishId: {}
  },
  emits: ["claim", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const loading = common_vendor.ref(false);
    async function handleClaim() {
      loading.value = true;
      try {
        emit("claim", props.wishId);
      } finally {
        loading.value = false;
      }
    }
    async function handleCancel() {
      loading.value = true;
      try {
        emit("cancel", props.wishId);
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.status === "unclaimed"
      }, _ctx.status === "unclaimed" ? {
        b: loading.value,
        c: common_vendor.o(handleClaim)
      } : _ctx.status === "claimed-by-me" ? {
        e: loading.value,
        f: common_vendor.o(handleCancel)
      } : _ctx.status === "claimed-by-other" ? {} : _ctx.status === "completed" ? {} : {}, {
        d: _ctx.status === "claimed-by-me",
        g: _ctx.status === "claimed-by-other",
        h: _ctx.status === "completed"
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9e1f4b63"]]);
wx.createComponent(Component);
