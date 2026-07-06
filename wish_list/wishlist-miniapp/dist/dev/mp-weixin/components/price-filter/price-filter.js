"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "price-filter",
  props: {
    maxLimit: { default: 1e4 },
    step: { default: 50 }
  },
  emits: ["change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const currentMin = common_vendor.ref(0);
    const currentMax = common_vendor.ref(props.maxLimit);
    const active = common_vendor.ref(false);
    const min = common_vendor.computed(() => currentMin.value);
    const max = common_vendor.computed(() => currentMax.value);
    const presets = [
      { label: "全部", min: 0, max: props.maxLimit },
      { label: "0-100", min: 0, max: 100 },
      { label: "100-500", min: 100, max: 500 },
      { label: "500-1000", min: 500, max: 1e3 },
      { label: "1000-5000", min: 1e3, max: 5e3 },
      { label: "5000+", min: 5e3, max: props.maxLimit }
    ];
    function onMinChange(e) {
      currentMin.value = Math.min(e.detail.value, currentMax.value);
      active.value = true;
      emitChange();
    }
    function onMaxChange(e) {
      currentMax.value = Math.max(e.detail.value, currentMin.value);
      active.value = true;
      emitChange();
    }
    function applyPreset(preset) {
      currentMin.value = preset.min;
      currentMax.value = preset.max;
      active.value = !(preset.min === 0 && preset.max === props.maxLimit);
      emitChange();
    }
    function isPresetActive(preset) {
      return currentMin.value === preset.min && currentMax.value === preset.max;
    }
    function handleClear() {
      currentMin.value = 0;
      currentMax.value = props.maxLimit;
      active.value = false;
      emitChange();
    }
    function emitChange() {
      emit("change", {
        min: currentMin.value,
        max: currentMax.value
      });
    }
    function reset() {
      currentMin.value = 0;
      currentMax.value = props.maxLimit;
      active.value = false;
    }
    __expose({
      reset
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(min.value),
        b: common_vendor.t(max.value),
        c: active.value
      }, active.value ? {
        d: common_vendor.o(handleClear)
      } : {}, {
        e: _ctx.maxLimit,
        f: _ctx.step,
        g: currentMin.value,
        h: common_vendor.o(onMinChange),
        i: _ctx.maxLimit,
        j: _ctx.step,
        k: currentMax.value,
        l: common_vendor.o(onMaxChange),
        m: common_vendor.f(presets, (preset, k0, i0) => {
          return {
            a: common_vendor.t(preset.label),
            b: preset.label,
            c: isPresetActive(preset) ? 1 : "",
            d: common_vendor.o(($event) => applyPreset(preset), preset.label)
          };
        })
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-28b7c768"]]);
wx.createComponent(Component);
