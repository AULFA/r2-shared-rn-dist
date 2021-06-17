"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMIL = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var smil_body_1 = require("./smil-body");
var smil_head_1 = require("./smil-head");
var smil_par_1 = require("./smil-par");
var SMIL = (function () {
    function SMIL() {
    }
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("head"),
        tslib_1.__metadata("design:type", smil_head_1.Head)
    ], SMIL.prototype, "Head", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("body"),
        tslib_1.__metadata("design:type", smil_body_1.Body)
    ], SMIL.prototype, "Body", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("dummy"),
        tslib_1.__metadata("design:type", smil_par_1.Par)
    ], SMIL.prototype, "Par", void 0);
    SMIL = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject({
            epub: "http://www.idpf.org/2007/ops",
            smil: "http://www.w3.org/ns/SMIL",
            smil2: "http://www.w3.org/2001/SMIL20/",
        })
    ], SMIL);
    return SMIL;
}());
exports.SMIL = SMIL;
//# sourceMappingURL=smil.js.map