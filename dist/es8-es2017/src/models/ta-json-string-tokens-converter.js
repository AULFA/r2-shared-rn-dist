"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearizeAccessModeSufficients = exports.DelinearizeAccessModeSufficients = exports.DelinearizeAccessModeSufficient = void 0;
const DelinearizeAccessModeSufficient = (ams) => {
    return ams.split(",").
        map((token) => token.trim()).
        filter((token) => token.length).
        reduce((pv, cv) => pv.includes(cv) ? pv : pv.concat(cv), []).
        filter((arr) => arr.length);
};
exports.DelinearizeAccessModeSufficient = DelinearizeAccessModeSufficient;
const DelinearizeAccessModeSufficients = (accessModeSufficients) => {
    return accessModeSufficients.map((ams) => exports.DelinearizeAccessModeSufficient(ams));
};
exports.DelinearizeAccessModeSufficients = DelinearizeAccessModeSufficients;
const LinearizeAccessModeSufficients = (accessModeSufficients) => {
    return accessModeSufficients.map((ams) => ams.join(","));
};
exports.LinearizeAccessModeSufficients = LinearizeAccessModeSufficients;
//# sourceMappingURL=ta-json-string-tokens-converter.js.map