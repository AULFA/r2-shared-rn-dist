"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rootfile = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/xml-js-mapper");
const decodeURI_1 = require("../../_utils/decodeURI");
let Rootfile = class Rootfile {
    get Path() {
        return this.Path1;
    }
    set Path(href) {
        this.Path1 = href;
        this._urlDecoded = undefined;
    }
    get PathDecoded() {
        if (this._urlDecoded) {
            return this._urlDecoded;
        }
        if (this._urlDecoded === null) {
            return undefined;
        }
        if (!this.Path) {
            this._urlDecoded = null;
            return undefined;
        }
        this._urlDecoded = decodeURI_1.tryDecodeURI(this.Path);
        return !this._urlDecoded ? undefined : this._urlDecoded;
    }
    set PathDecoded(href) {
        this._urlDecoded = href;
    }
    setPathDecoded(href) {
        this.Path = href;
        this.PathDecoded = href;
    }
};
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@media-type"),
    tslib_1.__metadata("design:type", String)
], Rootfile.prototype, "Type", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@version"),
    tslib_1.__metadata("design:type", String)
], Rootfile.prototype, "Version", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@full-path"),
    tslib_1.__metadata("design:type", String)
], Rootfile.prototype, "Path1", void 0);
Rootfile = tslib_1.__decorate([
    xml_js_mapper_1.XmlObject()
], Rootfile);
exports.Rootfile = Rootfile;
//# sourceMappingURL=container-rootfile.js.map