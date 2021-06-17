"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transformers = void 0;
var tslib_1 = require("tslib");
var transformer_lcp_1 = require("./transformer-lcp");
var transformer_obf_adobe_1 = require("./transformer-obf-adobe");
var transformer_obf_idpf_1 = require("./transformer-obf-idpf");
var Transformers = (function () {
    function Transformers() {
        this.transformers = [];
    }
    Transformers.instance = function () {
        return Transformers._instance;
    };
    Transformers.tryStream = function (publication, link, url, stream, isPartialByteRangeRequest, partialByteBegin, partialByteEnd, sessionInfo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2, Transformers.instance()._tryStream(publication, link, url, stream, isPartialByteRangeRequest, partialByteBegin, partialByteEnd, sessionInfo)];
            });
        });
    };
    Transformers.prototype.add = function (transformer) {
        if (this.transformers.indexOf(transformer) < 0) {
            this.transformers.push(transformer);
        }
    };
    Transformers.prototype._tryStream = function (publication, link, url, stream, isPartialByteRangeRequest, partialByteBegin, partialByteEnd, sessionInfo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var transformedData, atLeastOne, s, _i, _a, t, err_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        atLeastOne = false;
                        s = stream;
                        _i = 0, _a = this.transformers;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 7];
                        t = _a[_i];
                        if (!t.supports(publication, link)) return [3, 6];
                        atLeastOne = true;
                        if (!transformedData) return [3, 5];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4, transformedData];
                    case 3:
                        s = _b.sent();
                        return [3, 5];
                    case 4:
                        err_1 = _b.sent();
                        transformedData = undefined;
                        return [3, 7];
                    case 5:
                        transformedData = t.transformStream(publication, link, url, s, isPartialByteRangeRequest, partialByteBegin, partialByteEnd, sessionInfo);
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3, 1];
                    case 7:
                        if (transformedData) {
                            return [2, transformedData];
                        }
                        return [2, atLeastOne ? Promise.reject("transformers fail") : Promise.resolve(stream)];
                }
            });
        });
    };
    Transformers._instance = new Transformers();
    return Transformers;
}());
exports.Transformers = Transformers;
Transformers.instance().add(new transformer_obf_adobe_1.TransformerObfAdobe());
Transformers.instance().add(new transformer_obf_idpf_1.TransformerObfIDPF());
Transformers.instance().add(new transformer_lcp_1.TransformerLCP());
//# sourceMappingURL=transformer.js.map