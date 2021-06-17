"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/xml-js-mapper");
const decodeURI_1 = require("../../_utils/decodeURI");
let Reference = class Reference {
    get Href() {
        return this.Href1;
    }
    set Href(href) {
        this.Href1 = href;
        this._urlDecoded = undefined;
    }
    get HrefDecoded() {
        if (this._urlDecoded) {
            return this._urlDecoded;
        }
        if (this._urlDecoded === null) {
            return undefined;
        }
        if (!this.Href) {
            this._urlDecoded = null;
            return undefined;
        }
        this._urlDecoded = decodeURI_1.tryDecodeURI(this.Href);
        return !this._urlDecoded ? undefined : this._urlDecoded;
    }
    set HrefDecoded(href) {
        this._urlDecoded = href;
    }
    setHrefDecoded(href) {
        this.Href = href;
        this.HrefDecoded = href;
    }
};
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@title"),
    tslib_1.__metadata("design:type", String)
], Reference.prototype, "Title", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@type"),
    tslib_1.__metadata("design:type", String)
], Reference.prototype, "Type", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@href"),
    tslib_1.__metadata("design:type", String)
], Reference.prototype, "Href1", void 0);
Reference = tslib_1.__decorate([
    xml_js_mapper_1.XmlObject({
        dc: "http://purl.org/dc/elements/1.1/",
        opf: "http://www.idpf.org/2007/opf",
    })
], Reference);
exports.Reference = Reference;
//# sourceMappingURL=opf-reference.js.map