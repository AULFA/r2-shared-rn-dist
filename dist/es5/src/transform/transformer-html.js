"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformerHTML = void 0;
var tslib_1 = require("tslib");
var debug_ = require("debug");
var mime = require("mime-types");
var BufferUtils_1 = require("r2-utils-rn/dist/es5/src/_utils/stream/BufferUtils");
var debug = debug_("r2:shared#transform/transformer-html");
var TransformerHTML = (function () {
    function TransformerHTML(transformerFunction) {
        this.transformString = transformerFunction;
    }
    TransformerHTML.prototype.supports = function (_publication, link) {
        var mediaType = mime.lookup(link.Href);
        if (link && link.TypeLink) {
            mediaType = link.TypeLink;
        }
        if (mediaType === "text/html" || mediaType === "application/xhtml+xml") {
            return true;
        }
        return false;
    };
    TransformerHTML.prototype.transformStream = function (publication, link, url, stream, _isPartialByteRangeRequest, _partialByteBegin, _partialByteEnd, sessionInfo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_1, buff, err_2, sal;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, BufferUtils_1.streamToBufferPromise(stream.stream)];
                    case 1:
                        data = _a.sent();
                        return [3, 3];
                    case 2:
                        err_1 = _a.sent();
                        return [2, Promise.reject(err_1)];
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4, this.transformBuffer(publication, link, url, data, sessionInfo)];
                    case 4:
                        buff = _a.sent();
                        return [3, 6];
                    case 5:
                        err_2 = _a.sent();
                        return [2, Promise.reject(err_2)];
                    case 6:
                        sal = {
                            length: buff.length,
                            reset: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    return [2, Promise.resolve(sal)];
                                });
                            }); },
                            stream: BufferUtils_1.bufferToStream(buff),
                        };
                        return [2, Promise.resolve(sal)];
                }
            });
        });
    };
    TransformerHTML.prototype.transformBuffer = function (publication, link, url, data, sessionInfo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var str, str_;
            return tslib_1.__generator(this, function (_a) {
                try {
                    str = data.toString("utf8");
                    str_ = this.transformString(publication, link, url, str, sessionInfo);
                    return [2, Promise.resolve(Buffer.from(str_))];
                }
                catch (err) {
                    debug("TransformerHTML fail => no change");
                    debug(err);
                    return [2, Promise.resolve(data)];
                }
                return [2];
            });
        });
    };
    return TransformerHTML;
}());
exports.TransformerHTML = TransformerHTML;
//# sourceMappingURL=transformer-html.js.map