"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDivinaPublication = exports.Divinais = exports.DivinaParsePromise = void 0;
var tslib_1 = require("tslib");
var debug_ = require("debug");
var http = require("http");
var https = require("https");
var path = require("path");
var rnfs = require("react-native-fs");
var publication_1 = require("../models/publication");
var lcp_1 = require("r2-lcp-rn/dist/es5/src/parser/epub/lcp");
var serializable_1 = require("r2-lcp-rn/dist/es5/src/serializable");
var UrlUtils_1 = require("r2-utils-rn/dist/es5/src/_utils/http/UrlUtils");
var JsonUtils_1 = require("r2-utils-rn/dist/es5/src/_utils/JsonUtils");
var BufferUtils_1 = require("r2-utils-rn/dist/es5/src/_utils/stream/BufferUtils");
var zipFactory_1 = require("r2-utils-rn/dist/es5/src/_utils/zip/zipFactory");
var zipHasEntry_1 = require("../_utils/zipHasEntry");
var debug = debug_("r2:shared#parser/divina");
function absolutizeURLs(rootUrl, jsonObj) {
    JsonUtils_1.traverseJsonObjects(jsonObj, function (obj) {
        if (obj.href && typeof obj.href === "string"
            && !UrlUtils_1.isHTTP(obj.href)) {
            obj.href = rootUrl + "/" + obj.href;
        }
    });
}
function DivinaParsePromise(filePath, isDivina, pubtype) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var isAnDivina, _a, publicationType, entryName, filePathToLoad, url, zip, err_1, has, zipEntries, _i, zipEntries_1, zipEntry, manifestZipStream_, err_2, manifestZipStream, manifestZipData, err_3, manifestJsonStr, manifestJson, url, publication, lcpEntryName, checkLCP, hasLCP, has, lcpZipStream_, err_4, lcpZipStream, lcpZipData, err_5, lcpJsonStr, lcpJson, lcpl;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = isDivina;
                    if (_a) return [3, 2];
                    return [4, isDivinaPublication(filePath)];
                case 1:
                    _a = (_b.sent());
                    _b.label = 2;
                case 2:
                    isAnDivina = _a;
                    publicationType = pubtype || (isAnDivina ? "divina" : "generic");
                    entryName = "manifest.json";
                    filePathToLoad = filePath;
                    if (isAnDivina === Divinais.LocalExploded) {
                        filePathToLoad = path.dirname(filePathToLoad) + "/";
                    }
                    else if (isAnDivina === Divinais.RemoteExploded) {
                        url = new URL(filePathToLoad);
                        entryName = path.basename(url.pathname);
                        url.pathname = path.dirname(url.pathname) + "/";
                        filePathToLoad = url.toString();
                    }
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4, zipFactory_1.zipLoadPromise(filePathToLoad)];
                case 4:
                    zip = _b.sent();
                    return [3, 6];
                case 5:
                    err_1 = _b.sent();
                    return [2, Promise.reject(err_1)];
                case 6:
                    if (!zip.hasEntries()) {
                        return [2, Promise.reject("Divina zip empty")];
                    }
                    if (!(isAnDivina === Divinais.LocalExploded ||
                        isAnDivina === Divinais.LocalPacked)) return [3, 9];
                    return [4, zipHasEntry_1.zipHasEntry(zip, entryName, undefined)];
                case 7:
                    has = _b.sent();
                    if (!!has) return [3, 9];
                    return [4, zip.getEntries()];
                case 8:
                    zipEntries = _b.sent();
                    for (_i = 0, zipEntries_1 = zipEntries; _i < zipEntries_1.length; _i++) {
                        zipEntry = zipEntries_1[_i];
                        debug(zipEntry);
                    }
                    return [2, Promise.reject("Divina no manifest?!")];
                case 9:
                    _b.trys.push([9, 11, , 12]);
                    return [4, zip.entryStreamPromise(entryName)];
                case 10:
                    manifestZipStream_ = _b.sent();
                    return [3, 12];
                case 11:
                    err_2 = _b.sent();
                    debug(err_2);
                    return [2, Promise.reject("Problem streaming Divina zip entry?! " + entryName)];
                case 12:
                    manifestZipStream = manifestZipStream_.stream;
                    _b.label = 13;
                case 13:
                    _b.trys.push([13, 15, , 16]);
                    return [4, BufferUtils_1.streamToBufferPromise(manifestZipStream)];
                case 14:
                    manifestZipData = _b.sent();
                    return [3, 16];
                case 15:
                    err_3 = _b.sent();
                    debug(err_3);
                    return [2, Promise.reject("Problem buffering Divina zip entry?! " + entryName)];
                case 16:
                    manifestJsonStr = manifestZipData.toString("utf8");
                    manifestJson = JSON.parse(manifestJsonStr);
                    if (isAnDivina === Divinais.RemoteExploded) {
                        url = new URL(filePath);
                        url.pathname = path.dirname(url.pathname);
                        absolutizeURLs(url.toString(), manifestJson);
                    }
                    publication = serializable_1.TaJsonDeserialize(manifestJson, publication_1.Publication);
                    publication.AddToInternal("type", publicationType);
                    publication.AddToInternal("zip", zip);
                    lcpEntryName = "license.lcpl";
                    checkLCP = true;
                    hasLCP = false;
                    if (!(isAnDivina === Divinais.LocalExploded ||
                        isAnDivina === Divinais.LocalPacked)) return [3, 18];
                    return [4, zipHasEntry_1.zipHasEntry(zip, lcpEntryName, undefined)];
                case 17:
                    has = _b.sent();
                    if (!has) {
                        checkLCP = false;
                    }
                    else {
                        hasLCP = true;
                    }
                    _b.label = 18;
                case 18:
                    if (!checkLCP) return [3, 27];
                    lcpZipStream_ = void 0;
                    _b.label = 19;
                case 19:
                    _b.trys.push([19, 21, , 22]);
                    return [4, zip.entryStreamPromise(lcpEntryName)];
                case 20:
                    lcpZipStream_ = _b.sent();
                    return [3, 22];
                case 21:
                    err_4 = _b.sent();
                    if (hasLCP) {
                        debug(err_4);
                        return [2, Promise.reject("Problem streaming Divina LCP zip entry?! " + entryName)];
                    }
                    else {
                        debug("Divina no LCP.");
                    }
                    checkLCP = false;
                    return [3, 22];
                case 22:
                    if (!(checkLCP && lcpZipStream_)) return [3, 27];
                    lcpZipStream = lcpZipStream_.stream;
                    lcpZipData = void 0;
                    _b.label = 23;
                case 23:
                    _b.trys.push([23, 25, , 26]);
                    return [4, BufferUtils_1.streamToBufferPromise(lcpZipStream)];
                case 24:
                    lcpZipData = _b.sent();
                    return [3, 26];
                case 25:
                    err_5 = _b.sent();
                    debug(err_5);
                    return [2, Promise.reject("Problem buffering Divina LCP zip entry?! " + entryName)];
                case 26:
                    lcpJsonStr = lcpZipData.toString("utf8");
                    lcpJson = JSON.parse(lcpJsonStr);
                    lcpl = serializable_1.TaJsonDeserialize(lcpJson, lcp_1.LCP);
                    lcpl.ZipPath = lcpEntryName;
                    lcpl.JsonSource = lcpJsonStr;
                    lcpl.init();
                    publication.LCP = lcpl;
                    _b.label = 27;
                case 27: return [2, Promise.resolve(publication)];
            }
        });
    });
}
exports.DivinaParsePromise = DivinaParsePromise;
var Divinais;
(function (Divinais) {
    Divinais["LocalExploded"] = "LocalExploded";
    Divinais["LocalPacked"] = "LocalPacked";
    Divinais["RemoteExploded"] = "RemoteExploded";
    Divinais["RemotePacked"] = "RemotePacked";
})(Divinais = exports.Divinais || (exports.Divinais = {}));
function doRequest(u) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            return [2, new Promise(function (resolve, _reject) {
                    var url = new URL(u);
                    var secure = url.protocol === "https:";
                    var options = {
                        headers: {
                            "Accept": "*/*,application/divina+json",
                            "Accept-Language": "en-UK,en-US;q=0.7,en;q=0.5",
                            "Host": url.host,
                            "User-Agent": "Readium2-Divinas",
                        },
                        host: url.host,
                        method: "GET",
                        path: url.pathname + url.search,
                        port: secure ? 443 : 80,
                        protocol: url.protocol,
                    };
                    debug(JSON.stringify(options));
                    (secure ? https : http).request(options, function (res) {
                        if (!res) {
                            resolve(undefined);
                            return;
                        }
                        debug(res.statusCode);
                        debug(JSON.stringify(res.headers));
                        if (res.statusCode && (res.statusCode >= 300 && res.statusCode < 400)) {
                            var loc = res.headers.Location || res.headers.location;
                            if (loc && loc.length) {
                                var l_1 = Array.isArray(loc) ? loc[0] : loc;
                                process.nextTick(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var redirectRes, err_6;
                                    return tslib_1.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4, doRequest(l_1)];
                                            case 1:
                                                redirectRes = _a.sent();
                                                resolve(redirectRes);
                                                return [3, 3];
                                            case 2:
                                                err_6 = _a.sent();
                                                resolve(undefined);
                                                return [3, 3];
                                            case 3: return [2];
                                        }
                                    });
                                }); });
                            }
                            else {
                                resolve(undefined);
                            }
                            return;
                        }
                        var type = res.headers["Content-Type"] || res.headers["content-type"];
                        if (type) {
                            if (type.includes("application/divina+json")) {
                                resolve(Divinais.RemoteExploded);
                                return;
                            }
                            if (type.includes("application/json")) {
                                res.setEncoding("utf8");
                                var responseBody_1 = "";
                                res.on("data", function (chunk) {
                                    responseBody_1 += chunk;
                                });
                                res.on("end", function () {
                                    try {
                                        var manJson = JSON.parse(responseBody_1);
                                        if (manJson.metadata && manJson.metadata["@type"] &&
                                            (/http[s]?:\/\/schema\.org\/VisualArtwork$/.test(manJson.metadata["@type"]) ||
                                                /http[s]?:\/\/schema\.org\/ComicStory$/.test(manJson.metadata["@type"]))) {
                                            resolve(Divinais.RemoteExploded);
                                            return;
                                        }
                                        else {
                                            resolve(undefined);
                                        }
                                    }
                                    catch (ex) {
                                        debug(ex);
                                        resolve(undefined);
                                    }
                                });
                                return;
                            }
                        }
                        resolve(undefined);
                    }).on("error", function (err) {
                        debug(err);
                        resolve(undefined);
                    }).end();
                })];
        });
    });
}
function isDivinaPublication(urlOrPath) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var p, isHttp, url, fileName, ext, dnva, dnvaLcp, manStr, manJson, _1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = urlOrPath;
                    isHttp = UrlUtils_1.isHTTP(urlOrPath);
                    if (isHttp) {
                        url = new URL(urlOrPath);
                        p = url.pathname;
                    }
                    fileName = path.basename(p);
                    ext = path.extname(fileName).toLowerCase();
                    dnva = /\.divina$/.test(ext);
                    dnvaLcp = /\.lcpdivina$/.test(ext);
                    if (dnva || dnvaLcp) {
                        if (!isHttp) {
                            return [2, Divinais.LocalPacked];
                        }
                    }
                    if (!(!isHttp && fileName === "manifest.json")) return [3, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4, rnfs.stat(p)];
                case 2:
                    _a.sent();
                    return [4, rnfs.readFile(p, { encoding: "utf8" })];
                case 3:
                    manStr = _a.sent();
                    manJson = JSON.parse(manStr);
                    if (manJson.metadata && manJson.metadata["@type"] &&
                        (/http[s]?:\/\/schema\.org\/VisualArtwork$/.test(manJson.metadata["@type"]) ||
                            /http[s]?:\/\/schema\.org\/ComicStory$/.test(manJson.metadata["@type"]))) {
                        return [2, Divinais.LocalExploded];
                    }
                    return [3, 5];
                case 4:
                    _1 = _a.sent();
                    return [3, 5];
                case 5:
                    if (isHttp) {
                        return [2, doRequest(urlOrPath)];
                    }
                    return [2, Promise.resolve(undefined)];
            }
        });
    });
}
exports.isDivinaPublication = isDivinaPublication;
//# sourceMappingURL=divina.js.map