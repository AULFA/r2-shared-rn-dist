"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearizeAccessModeSufficients = exports.DelinearizeAccessModeSufficients = exports.DelinearizeAccessModeSufficient = void 0;
var DelinearizeAccessModeSufficient = function (ams) {
    return ams.split(",").
        map(function (token) { return token.trim(); }).
        filter(function (token) { return token.length; }).
        reduce(function (pv, cv) { return pv.includes(cv) ? pv : pv.concat(cv); }, []).
        filter(function (arr) { return arr.length; });
};
exports.DelinearizeAccessModeSufficient = DelinearizeAccessModeSufficient;
var DelinearizeAccessModeSufficients = function (accessModeSufficients) {
    return accessModeSufficients.map(function (ams) { return exports.DelinearizeAccessModeSufficient(ams); });
};
exports.DelinearizeAccessModeSufficients = DelinearizeAccessModeSufficients;
var LinearizeAccessModeSufficients = function (accessModeSufficients) {
    return accessModeSufficients.map(function (ams) { return ams.join(","); });
};
exports.LinearizeAccessModeSufficients = LinearizeAccessModeSufficients;
//# sourceMappingURL=ta-json-string-tokens-converter.js.map