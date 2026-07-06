"use strict";
const common_vendor = require("../../common/vendor.js");
const store_wish = require("../../store/wish.js");
const utils_parseUrl = require("../../utils/parse-url.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "add-item",
  setup(__props) {
    const wishStore = store_wish.useWishStore();
    const mode = common_vendor.ref("manual");
    const submitting = common_vendor.ref(false);
    const parsing = common_vendor.ref(false);
    const priceStr = common_vendor.ref("");
    const urlInput = common_vendor.ref("");
    const parsedProduct = common_vendor.ref(null);
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
    async function handleParse() {
      if (!urlInput.value.trim()) {
        common_vendor.index.showToast({ title: "请输入商品链接", icon: "none" });
        return;
      }
      parsing.value = true;
      try {
        const result = await utils_parseUrl.parseProductUrl(urlInput.value.trim());
        parsedProduct.value = result;
        common_vendor.index.showToast({ title: "解析成功", icon: "success" });
      } catch (e) {
        common_vendor.index.showToast({ title: e.message || "解析失败", icon: "none" });
      } finally {
        parsing.value = false;
      }
    }
    function useParsedData() {
      if (!parsedProduct.value) return;
      form.title = parsedProduct.value.title;
      form.description = parsedProduct.value.description;
      form.imageUrl = parsedProduct.value.imageUrl;
      form.price = parsedProduct.value.price;
      form.originalUrl = parsedProduct.value.originalUrl;
      priceStr.value = parsedProduct.value.price > 0 ? parsedProduct.value.price.toFixed(2) : "";
      mode.value = "manual";
    }
    async function handleSubmit() {
      if (!form.title.trim()) {
        common_vendor.index.showToast({ title: "请输入商品名称", icon: "none" });
        return;
      }
      form.price = utils_parseUrl.parsePrice(priceStr.value);
      submitting.value = true;
      try {
        await wishStore.addWish({
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
        a: mode.value === "manual" ? 1 : "",
        b: common_vendor.o(($event) => mode.value = "manual"),
        c: mode.value === "url" ? 1 : "",
        d: common_vendor.o(($event) => mode.value = "url"),
        e: mode.value === "manual"
      }, mode.value === "manual" ? common_vendor.e({
        f: form.imageUrl
      }, form.imageUrl ? {
        g: form.imageUrl
      } : {}, {
        h: common_vendor.o(chooseImage),
        i: form.title,
        j: common_vendor.o(($event) => form.title = $event.detail.value),
        k: form.description,
        l: common_vendor.o(($event) => form.description = $event.detail.value),
        m: priceStr.value,
        n: common_vendor.o(($event) => priceStr.value = $event.detail.value),
        o: form.originalUrl,
        p: common_vendor.o(($event) => form.originalUrl = $event.detail.value),
        q: common_vendor.f(categories, (cat, k0, i0) => {
          return {
            a: common_vendor.t(cat),
            b: cat,
            c: form.category === cat ? 1 : "",
            d: common_vendor.o(($event) => form.category = cat, cat)
          };
        }),
        r: common_vendor.f(priorityOptions, (p, k0, i0) => {
          return {
            a: common_vendor.t(p.label),
            b: p.value,
            c: form.priority === p.value ? 1 : "",
            d: common_vendor.o(($event) => form.priority = p.value, p.value)
          };
        })
      }) : common_vendor.e({
        s: urlInput.value,
        t: common_vendor.o(($event) => urlInput.value = $event.detail.value),
        v: parsing.value,
        w: common_vendor.o(handleParse),
        x: parsedProduct.value
      }, parsedProduct.value ? common_vendor.e({
        y: parsedProduct.value.imageUrl
      }, parsedProduct.value.imageUrl ? {
        z: parsedProduct.value.imageUrl
      } : {}, {
        A: common_vendor.t(parsedProduct.value.title),
        B: common_vendor.t(parsedProduct.value.price > 0 ? `¥${parsedProduct.value.price.toFixed(2)}` : "价格待定"),
        C: common_vendor.t(parsedProduct.value.platform),
        D: common_vendor.o(useParsedData)
      }) : {}), {
        E: submitting.value,
        F: common_vendor.o(handleSubmit)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-218cc6db"]]);
wx.createPage(MiniProgramPage);
