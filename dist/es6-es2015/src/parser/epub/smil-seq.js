"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seq = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/xml-js-mapper");
const decodeURI_1 = require("../../_utils/decodeURI");
const smil_seq_or_par_1 = require("./smil-seq-or-par");
let Seq = class Seq extends smil_seq_or_par_1.SeqOrPar {
    get TextRef() {
        return this.TextRef1;
    }
    set TextRef(href) {
        this.TextRef1 = href;
        this._urlDecoded = undefined;
    }
    get TextRefDecoded() {
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
    }
    set TextRefDecoded(href) {
        this._urlDecoded = href;
    }
    setTextRefDecoded(href) {
        this.TextRef = href;
        this.TextRefDecoded = href;
    }
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
exports.Seq = Seq;
//# sourceMappingURL=smil-seq.js.map