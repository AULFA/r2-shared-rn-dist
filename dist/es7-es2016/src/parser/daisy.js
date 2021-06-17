"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaisyParsePromise = exports.isDaisyPublication = exports.DaisyBookis = void 0;
const tslib_1 = require("tslib");
const debug_ = require("debug");
const moment = require("moment");
const path = require("path");
const rnfs = require("react-native-fs");
const metadata_1 = require("../models/metadata");
const publication_1 = require("../models/publication");
const UrlUtils_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/http/UrlUtils");
const zipFactory_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/zip/zipFactory");
const zipHasEntry_1 = require("../_utils/zipHasEntry");
const epub_daisy_common_1 = require("./epub-daisy-common");
const debug = debug_("r2:shared#parser/daisy");
var DaisyBookis;
(function (DaisyBookis) {
    DaisyBookis["LocalExploded"] = "LocalExploded";
    DaisyBookis["LocalPacked"] = "LocalPacked";
    DaisyBookis["RemoteExploded"] = "RemoteExploded";
    DaisyBookis["RemotePacked"] = "RemotePacked";
})(DaisyBookis = exports.DaisyBookis || (exports.DaisyBookis = {}));
function isLocalExploded(urlOrPath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield rnfs.stat(path.join(urlOrPath, "package.opf"));
        }
        catch (_) {
            try {
                yield rnfs.stat(path.join(urlOrPath, "Book.opf"));
            }
            catch (_) {
                try {
                    yield rnfs.stat(path.join(urlOrPath, "speechgen.opf"));
                }
                catch (_) {
                    throw null;
                }
            }
        }
        try {
            yield rnfs.stat(path.join(urlOrPath, "META-INF", "container.xml"));
        }
        catch (_) {
            return;
        }
        throw null;
    });
}
function isDaisyPublication(urlOrPath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let p = urlOrPath;
        const http = UrlUtils_1.isHTTP(urlOrPath);
        if (http) {
            const url = new URL(urlOrPath);
            p = url.pathname;
            return undefined;
        }
        else if (/\.daisy[23]?$/.test(path.extname(path.basename(p)).toLowerCase())) {
            return DaisyBookis.LocalPacked;
        }
        else {
            try {
                yield isLocalExploded(urlOrPath);
                return DaisyBookis.LocalExploded;
            }
            catch (_) {
                let zip;
                try {
                    zip = yield zipFactory_1.zipLoadPromise(urlOrPath);
                }
                catch (err) {
                    debug(err);
                    return Promise.reject(err);
                }
                if (!(yield zipHasEntry_1.zipHasEntry(zip, "META-INF/container.xml", undefined))) {
                    const entries = yield zip.getEntries();
                    const opfZipEntryPath = entries.find((entry) => {
                        return entry.endsWith(".opf");
                    });
                    if (!opfZipEntryPath) {
                        return undefined;
                    }
                    return DaisyBookis.LocalPacked;
                }
            }
        }
        return undefined;
    });
}
exports.isDaisyPublication = isDaisyPublication;
function DaisyParsePromise(filePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let zip;
        try {
            zip = yield zipFactory_1.zipLoadPromise(filePath);
        }
        catch (err) {
            debug(err);
            return Promise.reject(err);
        }
        if (!zip.hasEntries()) {
            return Promise.reject("Daisy zip empty");
        }
        const publication = new publication_1.Publication();
        publication.Context = ["https://readium.org/webpub-manifest/context.jsonld"];
        publication.Metadata = new metadata_1.Metadata();
        publication.Metadata.RDFType = "http://schema.org/Book";
        publication.Metadata.Modified = moment(Date.now()).toDate();
        publication.AddToInternal("filename", path.basename(filePath));
        publication.AddToInternal("type", "daisy");
        publication.AddToInternal("zip", zip);
        const entries = yield zip.getEntries();
        const opfZipEntryPath = entries.find((entry) => {
            return entry.endsWith(".opf");
        });
        if (!opfZipEntryPath) {
            return Promise.reject("OPF package XML file cannot be found.");
        }
        const rootfilePathDecoded = opfZipEntryPath;
        if (!rootfilePathDecoded) {
            return Promise.reject("?!rootfile.PathDecoded");
        }
        const opf = yield epub_daisy_common_1.getOpf(zip, rootfilePathDecoded, opfZipEntryPath);
        epub_daisy_common_1.addLanguage(publication, opf);
        epub_daisy_common_1.addTitle(publication, undefined, opf);
        epub_daisy_common_1.addIdentifier(publication, opf);
        epub_daisy_common_1.addOtherMetadata(publication, undefined, opf);
        epub_daisy_common_1.setPublicationDirection(publication, opf);
        epub_daisy_common_1.findContributorInMeta(publication, undefined, opf);
        yield epub_daisy_common_1.fillSpineAndResource(publication, undefined, opf, zip, addLinkData);
        let ncx;
        if (opf.Manifest) {
            let ncxManItem = opf.Manifest.find((manifestItem) => {
                return manifestItem.MediaType === "application/x-dtbncx+xml";
            });
            if (!ncxManItem) {
                ncxManItem = opf.Manifest.find((manifestItem) => {
                    return manifestItem.MediaType === "text/xml" &&
                        manifestItem.Href && manifestItem.Href.endsWith(".ncx");
                });
            }
            if (ncxManItem) {
                ncx = yield epub_daisy_common_1.getNcx(ncxManItem, opf, zip);
            }
        }
        epub_daisy_common_1.fillTOC(publication, opf, ncx);
        epub_daisy_common_1.fillSubject(publication, opf);
        epub_daisy_common_1.fillPublicationDate(publication, undefined, opf);
        return publication;
    });
}
exports.DaisyParsePromise = DaisyParsePromise;
const addLinkData = (publication, _rootfile, opf, zip, linkItem, item) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = publication.Metadata) === null || _a === void 0 ? void 0 : _a.AdditionalJSON) {
        const isFullTextAudio = publication.Metadata.AdditionalJSON["dtb:multimediaType"] === "audioFullText";
        const isTextOnly = publication.Metadata.AdditionalJSON["dtb:multimediaType"] === "textNCX";
        const isAudioOnly = publication.Metadata.AdditionalJSON["dtb:multimediaType"] === "audioNCX";
        if (isFullTextAudio || isTextOnly || isAudioOnly) {
            yield epub_daisy_common_1.addMediaOverlaySMIL(linkItem, item, opf, zip);
            if (linkItem.MediaOverlays && !linkItem.MediaOverlays.initialized) {
                yield epub_daisy_common_1.lazyLoadMediaOverlays(publication, linkItem.MediaOverlays);
                if (isFullTextAudio || isAudioOnly) {
                    epub_daisy_common_1.updateDurations(linkItem.MediaOverlays.duration, linkItem);
                }
            }
        }
    }
});
//# sourceMappingURL=daisy.js.map