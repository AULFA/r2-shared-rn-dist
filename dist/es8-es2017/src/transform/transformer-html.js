"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformerHTML = void 0;
const debug_ = require("debug");
const mime = require("mime-types");
const BufferUtils_1 = require("r2-utils-rn/dist/es8-es2017/src/_utils/stream/BufferUtils");
const debug = debug_("r2:shared#transform/transformer-html");
class TransformerHTML {
    constructor(transformerFunction) {
        this.transformString = transformerFunction;
    }
    supports(_publication, link) {
        let mediaType = mime.lookup(link.Href);
        if (link && link.TypeLink) {
            mediaType = link.TypeLink;
        }
        if (mediaType === "text/html" || mediaType === "application/xhtml+xml") {
            return true;
        }
        return false;
    }
    async transformStream(publication, link, url, stream, _isPartialByteRangeRequest, _partialByteBegin, _partialByteEnd, sessionInfo) {
        let data;
        try {
            data = await BufferUtils_1.streamToBufferPromise(stream.stream);
        }
        catch (err) {
            return Promise.reject(err);
        }
        let buff;
        try {
            buff = await this.transformBuffer(publication, link, url, data, sessionInfo);
        }
        catch (err) {
            return Promise.reject(err);
        }
        const sal = {
            length: buff.length,
            reset: async () => {
                return Promise.resolve(sal);
            },
            stream: BufferUtils_1.bufferToStream(buff),
        };
        return Promise.resolve(sal);
    }
    async transformBuffer(publication, link, url, data, sessionInfo) {
        try {
            const str = data.toString("utf8");
            const str_ = this.transformString(publication, link, url, str, sessionInfo);
            return Promise.resolve(Buffer.from(str_));
        }
        catch (err) {
            debug("TransformerHTML fail => no change");
            debug(err);
            return Promise.resolve(data);
        }
    }
}
exports.TransformerHTML = TransformerHTML;
//# sourceMappingURL=transformer-html.js.map