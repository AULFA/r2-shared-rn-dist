"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audio = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/xml-js-mapper");
const decodeURI_1 = require("../../_utils/decodeURI");
let Audio = class Audio {
    get Src() {
        return this.Src1;
    }
    set Src(href) {
        this.Src1 = href;
        this._urlDecoded = undefined;
    }
    get SrcDecoded() {
        if (this._urlDecoded) {
            return this._urlDecoded;
        }
        if (this._urlDecoded === null) {
            return undefined;
        }
        if (!this.Src) {
            this._urlDecoded = null;
            return undefined;
        }
        this._urlDecoded = decodeURI_1.tryDecodeURI(this.Src);
        return !this._urlDecoded ? undefined : this._urlDecoded;
    }
    set SrcDecoded(href) {
        this._urlDecoded = href;
    }
    setSrcDecoded(href) {
        this.Src = href;
        this.SrcDecoded = href;
    }
};
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@clipBegin"),
    tslib_1.__metadata("design:type", String)
], Audio.prototype, "ClipBegin", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@clipEnd"),
    tslib_1.__metadata("design:type", String)
], Audio.prototype, "ClipEnd", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@epub:type"),
    tslib_1.__metadata("design:type", String)
], Audio.prototype, "EpubType", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@src"),
    tslib_1.__metadata("design:type", String)
], Audio.prototype, "Src1", void 0);
Audio = tslib_1.__decorate([
    xml_js_mapper_1.XmlObject({
        epub: "http://www.idpf.org/2007/ops",
        smil: "http://www.w3.org/ns/SMIL",
        smil2: "http://www.w3.org/2001/SMIL20/",
        xml: "http://www.w3.org/XML/1998/namespace",
    })
], Audio);
exports.Audio = Audio;
//# sourceMappingURL=smil-audio.js.map