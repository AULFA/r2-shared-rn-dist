"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageList = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/xml-js-mapper");
const ncx_pagetarget_1 = require("./ncx-pagetarget");
let PageList = class PageList {
};
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("ncx:pageTarget"),
    xml_js_mapper_1.XmlItemType(ncx_pagetarget_1.PageTarget),
    tslib_1.__metadata("design:type", Array)
], PageList.prototype, "PageTarget", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@class"),
    tslib_1.__metadata("design:type", String)
], PageList.prototype, "Class", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@id | @xml:id"),
    tslib_1.__metadata("design:type", String)
], PageList.prototype, "ID", void 0);
PageList = tslib_1.__decorate([
    xml_js_mapper_1.XmlObject({
        ncx: "http://www.daisy.org/z3986/2005/ncx/",
        xml: "http://www.w3.org/XML/1998/namespace",
    })
], PageList);
exports.PageList = PageList;
//# sourceMappingURL=ncx-pagelist.js.map