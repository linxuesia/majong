"use strict";
const common_vendor = require("../../common/vendor.js");
const store_wish = require("../../store/wish.js");
const utils_parseUrl = require("../../utils/parse-url.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "edit-item",
  setup(__props) {
    const wishStore = store_wish.useWishStore();
    const itemId = common_vendor.ref("");
    const loading = common_vendor.ref(true);
    const submitting = common_vendor.ref(false);
    const priceStr = common_vendor.ref("");
    const categories = ["数码", "服饰", "美妆", "家居", "食品", "运动", "图书", "其他"];
    const priorityOptions = [
      { label: "一般", value: "low" },
      { label: "想要", value: "medium" },
      { label: "最想要", value: "high" }
    ];
    const form = common_vendor.reactive({
      title: "",
      description: "",
      imageUrl: "",
      price: 0,
      originalUrl: "",
      category: "其他",
      priority: "medium"
    });
    common_vendor.onLoad(async (options) => {
      const id = options == null ? void 0 : options.id;
      if (id) {
        itemId.value = id;
        await loadItem(id);
      }
    });
    async function loadItem(id) {
      loading.value = true;
      try {
        const item = await wishStore.fetchWishDetail(id);
        if (item) {
          form.title = item.title;
          form.description = item.description;
          form.imageUrl = item.imageUrl;
          form.price = item.price;
          form.originalUrl = item.originalUrl;
          form.category = item.category;
          form.priority = item.priority;
          priceStr.value = item.price > 0 ? item.price.toFixed(2) : "";
        } else {
          common_vendor.index.showToast({ title: "商品不存在", icon: "none" });
          setTimeout(() => common_vendor.index.navigateBack(), 1500);
        }
      } catch (e) {
        console.error("加载商品失败", e);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    }
    function chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempPath = res.tempFilePaths[0];
          common_vendor.index.showLoading({ title: "上传中..." });
          common_vendor.nr.uploadFile({
            filePath: tempPath,
            cloudPath: `wish-images/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
            success: (uploadRes) => {
              form.imageUrl = uploadRes.fileID;
              common_vendor.index.hideLoading();
            },
            fail: () => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "图片上传失败", icon: "none" });
            }
          });
        }
      });
    }
    async function handleSubmit() {
      if (!form.title.trim()) {
        common_vendor.index.showToast({ title: "请输入商品名称", icon: "none" });
        return;
      }
      form.price = utils_parseUrl.parsePrice(priceStr.value);
      submitting.value = true;
      try {
        await wishStore.updateWish({
          id: itemId.value,
          title: form.title.trim(),
          description: form.description.trim(),
          imageUrl: form.imageUrl,
          price: form.price,
          originalUrl: form.originalUrl.trim(),
          category: form.category,
          priority: form.priority
        });
        common_vendor.index.navigateBack();
      } catch {
      } finally {
        submitting.value = false;
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {} : common_vendor.e({
        b: form.imageUrl
      }, form.imageUrl ? {
        c: form.imageUrl
      } : {}, {
        d: common_vendor.o(chooseImage),
        e: form.title,
        f: common_vendor.o(($event) => form.title = $event.detail.value),
        g: form.description,
        h: common_vendor.o(($event) => form.description = $event.detail.value),
        i: priceStr.value,
        j: common_vendor.o(($event) => priceStr.value = $event.detail.value),
        k: form.originalUrl,
        l: common_vendor.o(($event) => form.originalUrl = $event.detail.value),
        m: common_vendor.f(categories, (cat, k0, i0) => {
          return {
            a: common_vendor.t(cat),
            b: cat,
            c: form.category === cat ? 1 : "",
            d: common_vendor.o(($event) => form.category = cat, cat)
          };
        }),
        n: common_vendor.f(priorityOptions, (p, k0, i0) => {
          return {
            a: common_vendor.t(p.label),
            b: p.value,
            c: form.priority === p.value ? 1 : "",
            d: common_vendor.o(($event) => form.priority = p.value, p.value)
          };
        }),
        o: submitting.value,
        p: common_vendor.o(handleSubmit)
      }));
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-785c64c3"]]);
wx.createPage(MiniProgramPage);
