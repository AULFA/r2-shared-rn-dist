"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seq = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var decodeURI_1 = require("../../_utils/decodeURI");
var smil_seq_or_par_1 = require("./smil-seq-or-par");
var Seq = (function (_super) {
    tslib_1.__extends(Seq, _super);
    function Seq() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Seq.prototype, "TextRef", {
        get: function () {
            return this.TextRef1;
        },
        set: function (href) {
            this.TextRef1 = href;
            this._urlDecoded = undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Seq.prototype, "TextRefDecoded", {
        get: function () {
            if (this._urlDecoded) {
                return this._urlDecoded;
            }
            if (this._urlDecoded === null) {
                return undefined;
            }
            if (!this.TextRef) {
                this._urlDecoded = null;
                return undefined;
            }
            this._urlDecoded = decodeURI_1.tryDecodeURI(this.TextRef);
            return !this._urlDecoded ? undefined : this._urlDecoded;
        },
        set: function (href) {
            this._urlDecoded = href;
        },
        enumerable: false,
        configurable: true
    });
    Seq.prototype.setTextRefDecoded = function (href) {
        this.TextRef = href;
        this.TextRefDecoded = href;
    };
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("smil:par | smil:seq | smil2:par | smil2:seq"),
        xml_js_mapper_1.XmlItemType(smil_seq_or_par_1.SeqOrPar),
        tslib_1.__metadata("design:type", Array)
    ], Seq.prototype, "Children", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@epub:textref"),
        tslib_1.__metadata("design:type", String)
    ], Seq.prototype, "TextRef1", void 0);
    Seq = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject({
            epub: "http://www.idpf.org/2007/ops",
            smil: "http://www.w3.org/ns/SMIL",
            smil2: "http://www.w3.org/2001/SMIL20/",
        }),
        xml_js_mapper_1.XmlDiscriminatorValue("seq")
    ], Seq);
    return Seq;
}(smil_seq_or_par_1.SeqOrPar));
exports.Seq = Seq;
//# sourceMappingURL=smil-seq.js.map