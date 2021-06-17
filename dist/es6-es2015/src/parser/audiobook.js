"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAudioBookPublication = exports.AudioBookis = exports.AudioBookParsePromise = void 0;
const tslib_1 = require("tslib");
const debug_ = require("debug");
const http = require("http");
const https = require("https");
const path = require("path");
const rnfs = require("react-native-fs");
const publication_1 = require("../models/publication");
const lcp_1 = require("r2-lcp-rn/dist/es6-es2015/src/parser/epub/lcp");
const serializable_1 = require("r2-lcp-rn/dist/es6-es2015/src/serializable");
const UrlUtils_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/http/UrlUtils");
const JsonUtils_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/JsonUtils");
const BufferUtils_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/stream/BufferUtils");
const zipFactory_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/zip/zipFactory");
const zipHasEntry_1 = require("../_utils/zipHasEntry");
const debug = debug_("r2:shared#parser/audiobook");
function absolutizeURLs(rootUrl, jsonObj) {
    JsonUtils_1.traverseJsonObjects(jsonObj, (obj) => {
        if (obj.href && typeof obj.href === "string"
            && !UrlUtils_1.isHTTP(obj.href)) {
            obj.href = rootUrl + "/" + obj.href;
        }
    });
}
function AudioBookParsePromise(filePath, isAudio) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const isAnAudioBook = isAudio || (yield isAudioBookPublication(filePath));
        let entryName = "manifest.json";
        let filePathToLoad = filePath;
        if (isAnAudioBook === AudioBookis.LocalExploded) {
            filePathToLoad = path.dirname(filePathToLoad) + "/";
        }
        else if (isAnAudioBook === AudioBookis.RemoteExploded) {
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
            return Promise.reject("AudioBook zip empty");
        }
        if (isAnAudioBook === AudioBookis.LocalExploded ||
            isAnAudioBook === AudioBookis.LocalPacked) {
            const has = yield zipHasEntry_1.zipHasEntry(zip, entryName, undefined);
            if (!has) {
                const zipEntries = yield zip.getEntries();
                for (const zipEntry of zipEntries) {
                    debug(zipEntry);
                }
                return Promise.reject("AudioBook no manifest?!");
            }
        }
        let manifestZipStream_;
        try {
            manifestZipStream_ = yield zip.entryStreamPromise(entryName);
        }
        catch (err) {
            debug(err);
            return Promise.reject(`Problem streaming AudioBook zip entry?! ${entryName}`);
        }
        const manifestZipStream = manifestZipStream_.stream;
        let manifestZipData;
        try {
            manifestZipData = yield BufferUtils_1.streamToBufferPromise(manifestZipStream);
        }
        catch (err) {
            debug(err);
            return Promise.reject(`Problem buffering AudioBook zip entry?! ${entryName}`);
        }
        const manifestJsonStr = manifestZipData.toString("utf8");
        const manifestJson = JSON.parse(manifestJsonStr);
        if (isAnAudioBook === AudioBookis.RemoteExploded) {
            const url = new URL(filePath);
            url.pathname = path.dirname(url.pathname);
            absolutizeURLs(url.toString(), manifestJson);
        }
        const publication = serializable_1.TaJsonDeserialize(manifestJson, publication_1.Publication);
        publication.AddToInternal("type", "audiobook");
        publication.AddToInternal("zip", zip);
        const lcpEntryName = "license.lcpl";
        let checkLCP = true;
        let hasLCP = false;
        if (isAnAudioBook === AudioBookis.LocalExploded ||
            isAnAudioBook === AudioBookis.LocalPacked) {
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
                    return Promise.reject(`Problem streaming AudioBook LCP zip entry?! ${entryName}`);
                }
                else {
                    debug("Audiobook no LCP.");
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
                    return Promise.reject(`Problem buffering AudioBook LCP zip entry?! ${entryName}`);
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
exports.AudioBookParsePromise = AudioBookParsePromise;
var AudioBookis;
(function (AudioBookis) {
    AudioBookis["LocalExploded"] = "LocalExploded";
    AudioBookis["LocalPacked"] = "LocalPacked";
    AudioBookis["RemoteExploded"] = "RemoteExploded";
})(AudioBookis = exports.AudioBookis || (exports.AudioBookis = {}));
function doRequest(u) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const url = new URL(u);
            const secure = url.protocol === "https:";
            const options = {
                headers: {
                    "Accept": "*/*,application/audiobook+json",
                    "Accept-Language": "en-UK,en-US;q=0.7,en;q=0.5",
                    "Host": url.host,
                    "User-Agent": "Readium2-AudioBooks",
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
                    reject(`HTTP no response ${u}`);
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
                                reject(`HTTP audiobook redirect, then fail ${u} ${err}`);
                            }
                        }));
                    }
                    else {
                        reject(`HTTP audiobook redirect without location?! ${u}`);
                    }
                    return;
                }
                const type = res.headers["Content-Type"] || res.headers["content-type"];
                if (type) {
                    if (type.includes("application/audiobook+json")) {
                        resolve(AudioBookis.RemoteExploded);
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
                                    /http[s]?:\/\/schema\.org\/Audiobook$/.test(manJson.metadata["@type"])) {
                                    resolve(AudioBookis.RemoteExploded);
                                    return;
                                }
                                else {
                                    reject(`HTTP JSON not audiobook ${u}`);
                                }
                            }
                            catch (ex) {
                                debug(ex);
                                reject(`HTTP audiobook invalid JSON?! ${u} ${ex}`);
                            }
                        });
                        return;
                    }
                }
                reject(`Not HTTP audiobook type ${u}`);
            }).on("error", (err) => {
                debug(err);
                reject(`HTTP error ${u} ${err}`);
            }).end();
        });
    });
}
function isAudioBookPublication(urlOrPath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let p = urlOrPath;
        const isHttp = UrlUtils_1.isHTTP(urlOrPath);
        if (isHttp) {
            const url = new URL(urlOrPath);
            p = url.pathname;
        }
        const fileName = path.basename(p);
        const ext = path.extname(fileName).toLowerCase();
        const audio = /\.audiobook$/.test(ext);
        const audioLcp = /\.lcpa$/.test(ext);
        const audioLcpAlt = /\.lcpaudiobook$/.test(ext);
        if (audio || audioLcp || audioLcpAlt) {
            if (!isHttp) {
                return AudioBookis.LocalPacked;
            }
        }
        if (!isHttp && fileName === "manifest.json") {
            try {
                yield rnfs.stat(p);
                const manStr = yield rnfs.readFile(p, { encoding: "utf8" });
                const manJson = JSON.parse(manStr);
                if (manJson.metadata && manJson.metadata["@type"] &&
                    /http[s]?:\/\/schema\.org\/Audiobook$/.test(manJson.metadata["@type"])) {
                    return AudioBookis.LocalExploded;
                }
            }
            catch (_) {
            }
        }
        if (isHttp) {
            return doRequest(urlOrPath);
        }
        return Promise.reject("Cannot determine audiobook type");
    });
}
exports.isAudioBookPublication = isAudioBookPublication;
//# sourceMappingURL=audiobook.js.map