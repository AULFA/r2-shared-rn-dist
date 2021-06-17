"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryDecodeURI = void 0;
function tryDecodeURI(url) {
    if (!url) {
        return null;
    }
    try {
        return decodeURIComponent(url);
    }
    catch (err) {
        console.log(url);
        console.log(err);
    }
    return url;
}
exports.tryDecodeURI = tryDecodeURI;
//# sourceMappingURL=decodeURI.js.map