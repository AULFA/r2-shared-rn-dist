"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDivinaPublication = exports.Divinais = exports.DivinaParsePromise = void 0;
const tslib_1 = require("tslib");
const debug_ = require("debug");
const http = require("http");
const https = require("https");
const path = require("path");
const rnfs = require("react-native-fs");
const publication_1 = require("../models/publication");
const lcp_1 = require("r2-lcp-rn/dist/es7-es2016/src/parser/epub/lcp");
const serializable_1 = require("r2-lcp-rn/dist/es7-es2016/src/serializable");
const UrlUtils_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/http/UrlUtils");
const JsonUtils_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/JsonUtils");
const BufferUtils_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/stream/BufferUtils");
const zipFactory_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/zip/zipFactory");
const zipHasEntry_1 = require("../_utils/zipHasEntry");
const debug = debug_("r2:shared#parser/divina");
function absolutizeURLs(rootUrl, jsonObj) {
    JsonUtils_1.traverseJsonObjects(jsonObj, (obj) => {
        if (obj.href && typeof obj.href === "string"
            && !UrlUtils_1.isHTTP(obj.href)) {
            obj.href = rootUrl + "/" + obj.href;
        }
    });
}
function DivinaParsePromise(filePath, isDivina, pubtype) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const isAnDivina = isDivina || (yield isDivinaPublication(filePath));
        const publicationType = pubtype || (isAnDivina ? "divina" : "generic");
        let entryName = "manifest.json";
        let filePathToLoad = filePath;
        if (isAnDivina === Divinais.LocalExploded) {
            filePathToLoad = path.dirname(filePathToLoad) + "/";
        }
        else if (isAnDivina === Divinais.RemoteExploded) {
            const url = new URL(filePathToLoad);
            entryName = path.basename(url.pathname);
            url.pathname = path.dirname(url.pathname) + "/";
            filePathToLoad = url.toString();
        }
        let zip;
        try {
            zip = yield zipFactory_1.zipLoadPromise(filePathToLoad);
        }
        catch (err) {
            return Promise.reject(err);
        }
        if (!zip.hasEntries()) {
            return Promise.reject("Divina zip empty");
        }
        if (isAnDivina === Divinais.LocalExploded ||
            isAnDivina === Divinais.LocalPacked) {
            const has = yield zipHasEntry_1.zipHasEntry(zip, entryName, undefined);
            if (!has) {
                const zipEntries = yield zip.getEntries();
                for (const zipEntry of zipEntries) {
                    debug(zipEntry);
                }
                return Promise.reject("Divina no manifest?!");
            }
        }
        let manifestZipStream_;
        try {
            manifestZipStream_ = yield zip.entryStreamPromise(entryName);
        }
        catch (err) {
            debug(err);
            return Promise.reject(`Problem streaming Divina zip entry?! ${entryName}`);
        }
        const manifestZipStream = manifestZipStream_.stream;
        let manifestZipData;
        try {
            manifestZipData = yield BufferUtils_1.streamToBufferPromise(manifestZipStream);
        }
        catch (err) {
            debug(err);
            return Promise.reject(`Problem buffering Divina zip entry?! ${entryName}`);
        }
        const manifestJsonStr = manifestZipData.toString("utf8");
        const manifestJson = JSON.parse(manifestJsonStr);
        if (isAnDivina === Divinais.RemoteExploded) {
            const url = new URL(filePath);
            url.pathname = path.dirname(url.pathname);
            absolutizeURLs(url.toString(), manifestJson);
        }
        const publication = serializable_1.TaJsonDeserialize(manifestJson, publication_1.Publication);
        publication.AddToInternal("type", publicationType);
        publication.AddToInternal("zip", zip);
        const lcpEntryName = "license.lcpl";
        let checkLCP = true;
        let hasLCP = false;
        if (isAnDivina === Divinais.LocalExploded ||
            isAnDivina === Divinais.LocalPacked) {
            const has = yield zipHasEntry_1.zipHasEntry(zip, lcpEntryName, undefined);
            if (!has) {
                checkLCP = false;
            }
            else {
                hasLCP = true;
            }
        }
        if (checkLCP) {
            let lcpZipStream_;
            try {
                lcpZipStream_ = yield zip.entryStreamPromise(lcpEntryName);
            }
            catch (err) {
                if (hasLCP) {
                    debug(err);
                    return Promise.reject(`Problem streaming Divina LCP zip entry?! ${entryName}`);
                }
                else {
                    debug("Divina no LCP.");
                }
                checkLCP = false;
            }
            if (checkLCP && lcpZipStream_) {
                const lcpZipStream = lcpZipStream_.stream;
                let lcpZipData;
                try {
                    lcpZipData = yield BufferUtils_1.streamToBufferPromise(lcpZipStream);
                }
                catch (err) {
                    debug(err);
                    return Promise.reject(`Problem buffering Divina LCP zip entry?! ${entryName}`);
                }
                const lcpJsonStr = lcpZipData.toString("utf8");
                const lcpJson = JSON.parse(lcpJsonStr);
                const lcpl = serializable_1.TaJsonDeserialize(lcpJson, lcp_1.LCP);
                lcpl.ZipPath = lcpEntryName;
                lcpl.JsonSource = lcpJsonStr;
                lcpl.init();
                publication.LCP = lcpl;
            }
        }
        return Promise.resolve(publication);
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _reject) => {
            const url = new URL(u);
            const secure = url.protocol === "https:";
            const options = {
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
            (secure ? https : http).request(options, (res) => {
                if (!res) {
                    resolve(undefined);
                    return;
                }
                debug(res.statusCode);
                debug(JSON.stringify(res.headers));
                if (res.statusCode && (res.statusCode >= 300 && res.statusCode < 400)) {
                    const loc = res.headers.Location || res.headers.location;
                    if (loc && loc.length) {
                        const l = Array.isArray(loc) ? loc[0] : loc;
                        process.nextTick(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            try {
                                const redirectRes = yield doRequest(l);
                                resolve(redirectRes);
                            }
                            catch (err) {
                                resolve(undefined);
                            }
                        }));
                    }
                    else {
                        resolve(undefined);
                    }
                    return;
                }
                const type = res.headers["Content-Type"] || res.headers["content-type"];
                if (type) {
                    if (type.includes("application/divina+json")) {
                        resolve(Divinais.RemoteExploded);
                        return;
                    }
                    if (type.includes("application/json")) {
                        res.setEncoding("utf8");
                        let responseBody = "";
                        res.on("data", (chunk) => {
                            responseBody += chunk;
                        });
                        res.on("end", () => {
                            try {
                                const manJson = JSON.parse(responseBody);
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
            }).on("error", (err) => {
                debug(err);
                resolve(undefined);
            }).end();
        });
    });
}
function isDivinaPublication(urlOrPath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let p = urlOrPath;
        const isHttp = UrlUtils_1.isHTTP(urlOrPath);
        if (isHttp) {
            const url = new URL(urlOrPath);
            p = url.pathname;
        }
        const fileName = path.basename(p);
        const ext = path.extname(fileName).toLowerCase();
        const dnva = /\.divina$/.test(ext);
        const dnvaLcp = /\.lcpdivina$/.test(ext);
        if (dnva || dnvaLcp) {
            if (!isHttp) {
                return Divinais.LocalPacked;
            }
        }
        if (!isHttp && fileName === "manifest.json") {
            try {
                yield rnfs.stat(p);
                const manStr = yield rnfs.readFile(p, { encoding: "utf8" });
                const manJson = JSON.parse(manStr);
                if (manJson.metadata && manJson.metadata["@type"] &&
                    (/http[s]?:\/\/schema\.org\/VisualArtwork$/.test(manJson.metadata["@type"]) ||
                        /http[s]?:\/\/schema\.org\/ComicStory$/.test(manJson.metadata["@type"]))) {
                    return Divinais.LocalExploded;
                }
            }
            catch (_) {
            }
        }
        if (isHttp) {
            return doRequest(urlOrPath);
        }
        return Promise.resolve(undefined);
    });
}
exports.isDivinaPublication = isDivinaPublication;
//# sourceMappingURL=divina.js.map