"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaOverlay = exports.getAllMediaOverlays = exports.EpubParsePromise = exports.isEPUBlication = exports.EPUBis = exports.addCoverDimensions = exports.mediaOverlayURLParam = exports.mediaOverlayURLPath = exports.BCP47_UNKNOWN_LANG = void 0;
var tslib_1 = require("tslib");
var debug_ = require("debug");
var image_size_1 = require("image-size");
var moment = require("moment");
var path = require("path");
var rnfs = require("react-native-fs");
var url_1 = require("url");
var xmldom = require("xmldom");
var xpath = require("xpath");
var media_overlay_1 = require("../models/media-overlay");
var metadata_1 = require("../models/metadata");
var metadata_belongsto_1 = require("../models/metadata-belongsto");
var metadata_contributor_1 = require("../models/metadata-contributor");
var metadata_properties_1 = require("../models/metadata-properties");
var publication_1 = require("../models/publication");
var publication_link_1 = require("../models/publication-link");
var metadata_encrypted_1 = require("r2-lcp-rn/dist/es5/src/models/metadata-encrypted");
var lcp_1 = require("r2-lcp-rn/dist/es5/src/parser/epub/lcp");
var serializable_1 = require("r2-lcp-rn/dist/es5/src/serializable");
var UrlUtils_1 = require("r2-utils-rn/dist/es5/src/_utils/http/UrlUtils");
var BufferUtils_1 = require("r2-utils-rn/dist/es5/src/_utils/stream/BufferUtils");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var zipFactory_1 = require("r2-utils-rn/dist/es5/src/_utils/zip/zipFactory");
var decodeURI_1 = require("../_utils/decodeURI");
var zipHasEntry_1 = require("../_utils/zipHasEntry");
var epub_daisy_common_1 = require("./epub-daisy-common");
var container_1 = require("./epub/container");
var display_options_1 = require("./epub/display-options");
var encryption_1 = require("./epub/encryption");
var debug = debug_("r2:shared#parser/epub");
exports.BCP47_UNKNOWN_LANG = epub_daisy_common_1.BCP47_UNKNOWN_LANG;
exports.mediaOverlayURLPath = epub_daisy_common_1.mediaOverlayURLPath;
exports.mediaOverlayURLParam = epub_daisy_common_1.mediaOverlayURLParam;
var addCoverDimensions = function (publication, coverLink) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var zipInternal, zip, coverLinkHrefDecoded, has, zipEntries, _i, zipEntries_1, zipEntry, zipStream, err_1, zipData, imageInfo, err_2;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                zipInternal = publication.findFromInternal("zip");
                if (!zipInternal) return [3, 11];
                zip = zipInternal.Value;
                coverLinkHrefDecoded = coverLink.HrefDecoded;
                if (!coverLinkHrefDecoded) {
                    return [2];
                }
                return [4, zipHasEntry_1.zipHasEntry(zip, coverLinkHrefDecoded, coverLink.Href)];
            case 1:
                has = _a.sent();
                if (!!has) return [3, 3];
                debug("NOT IN ZIP (addCoverDimensions): " + coverLink.Href + " --- " + coverLinkHrefDecoded);
                return [4, zip.getEntries()];
            case 2:
                zipEntries = _a.sent();
                for (_i = 0, zipEntries_1 = zipEntries; _i < zipEntries_1.length; _i++) {
                    zipEntry = zipEntries_1[_i];
                    debug(zipEntry);
                }
                return [2];
            case 3:
                zipStream = void 0;
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4, zip.entryStreamPromise(coverLinkHrefDecoded)];
            case 5:
                zipStream = _a.sent();
                return [3, 7];
            case 6:
                err_1 = _a.sent();
                debug(coverLinkHrefDecoded);
                debug(coverLink.TypeLink);
                debug(err_1);
                return [2];
            case 7:
                zipData = void 0;
                _a.label = 8;
            case 8:
                _a.trys.push([8, 10, , 11]);
                return [4, BufferUtils_1.streamToBufferPromise(zipStream.stream)];
            case 9:
                zipData = _a.sent();
                imageInfo = image_size_1.imageSize(zipData);
                if (imageInfo && imageInfo.width && imageInfo.height) {
                    coverLink.Width = imageInfo.width;
                    coverLink.Height = imageInfo.height;
                    if (coverLink.TypeLink &&
                        coverLink.TypeLink.replace("jpeg", "jpg").replace("+xml", "")
                            !== ("image/" + imageInfo.type)) {
                        debug("Wrong image type? " + coverLink.TypeLink + " -- " + imageInfo.type);
                    }
                }
                return [3, 11];
            case 10:
                err_2 = _a.sent();
                debug(coverLinkHrefDecoded);
                debug(coverLink.TypeLink);
                debug(err_2);
                return [3, 11];
            case 11: return [2];
        }
    });
}); };
exports.addCoverDimensions = addCoverDimensions;
var EPUBis;
(function (EPUBis) {
    EPUBis["LocalExploded"] = "LocalExploded";
    EPUBis["LocalPacked"] = "LocalPacked";
    EPUBis["RemoteExploded"] = "RemoteExploded";
    EPUBis["RemotePacked"] = "RemotePacked";
})(EPUBis = exports.EPUBis || (exports.EPUBis = {}));
function isEPUBlication(urlOrPath) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var p, http, url, _1, fileName, ext, epub;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = urlOrPath;
                    http = UrlUtils_1.isHTTP(urlOrPath);
                    if (!http) return [3, 1];
                    url = new url_1.URL(urlOrPath);
                    p = url.pathname;
                    return [3, 4];
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, rnfs.stat(path.join(urlOrPath, "META-INF", "container.xml"))];
                case 2:
                    _a.sent();
                    return [2, EPUBis.LocalExploded];
                case 3:
                    _1 = _a.sent();
                    return [3, 4];
                case 4:
                    fileName = path.basename(p);
                    ext = path.extname(fileName).toLowerCase();
                    epub = /\.epub[3]?$/.test(ext);
                    if (epub) {
                        return [2, http ? EPUBis.RemotePacked : EPUBis.LocalPacked];
                    }
                    if (/META-INF[\/|\\]container.xml$/.test(p)) {
                        return [2, http ? EPUBis.RemoteExploded : EPUBis.LocalExploded];
                    }
                    return [2, undefined];
            }
        });
    });
}
exports.isEPUBlication = isEPUBlication;
function EpubParsePromise(filePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var isAnEPUB, filePathToLoad, url, zip, err_3, publication, lcpl, lcplZipPath, has, lcplZipStream_, err_4, lcplZipStream, lcplZipData, err_5, lcplStr, lcplJson, mime, encryption, encZipPath, encryptionXmlZipStream_, err_6, encryptionXmlZipStream, encryptionXmlZipData, err_7, encryptionXmlStr, encryptionXmlDoc, containerZipPath, containerXmlZipStream_, err_8, containerXmlZipStream, containerXmlZipData, err_9, containerXmlStr, containerXmlDoc, container, rootfile, rootfilePathDecoded, opf, ncx, ncxManItem, pageMapLink;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, isEPUBlication(filePath)];
                case 1:
                    isAnEPUB = _a.sent();
                    filePathToLoad = filePath;
                    if (isAnEPUB === EPUBis.LocalExploded) {
                        filePathToLoad = filePathToLoad.replace(/META-INF[\/|\\]container.xml$/, "");
                    }
                    else if (isAnEPUB === EPUBis.RemoteExploded) {
                        url = new url_1.URL(filePathToLoad);
                        url.pathname = url.pathname.replace(/META-INF[\/|\\]container.xml$/, "");
                        filePathToLoad = url.toString();
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, zipFactory_1.zipLoadPromise(filePathToLoad)];
                case 3:
                    zip = _a.sent();
                    return [3, 5];
                case 4:
                    err_3 = _a.sent();
                    debug(err_3);
                    return [2, Promise.reject(err_3)];
                case 5:
                    if (!zip.hasEntries()) {
                        return [2, Promise.reject("EPUB zip empty")];
                    }
                    publication = new publication_1.Publication();
                    publication.Context = ["https://readium.org/webpub-manifest/context.jsonld"];
                    publication.Metadata = new metadata_1.Metadata();
                    publication.Metadata.RDFType = "http://schema.org/Book";
                    publication.Metadata.Modified = moment(Date.now()).toDate();
                    publication.AddToInternal("filename", path.basename(filePath));
                    publication.AddToInternal("type", "epub");
                    publication.AddToInternal("zip", zip);
                    lcplZipPath = "META-INF/license.lcpl";
                    return [4, zipHasEntry_1.zipHasEntry(zip, lcplZipPath, undefined)];
                case 6:
                    has = _a.sent();
                    if (!has) return [3, 15];
                    lcplZipStream_ = void 0;
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4, zip.entryStreamPromise(lcplZipPath)];
                case 8:
                    lcplZipStream_ = _a.sent();
                    return [3, 10];
                case 9:
                    err_4 = _a.sent();
                    debug(err_4);
                    return [2, Promise.reject(err_4)];
                case 10:
                    lcplZipStream = lcplZipStream_.stream;
                    lcplZipData = void 0;
                    _a.label = 11;
                case 11:
                    _a.trys.push([11, 13, , 14]);
                    return [4, BufferUtils_1.streamToBufferPromise(lcplZipStream)];
                case 12:
                    lcplZipData = _a.sent();
                    return [3, 14];
                case 13:
                    err_5 = _a.sent();
                    debug(err_5);
                    return [2, Promise.reject(err_5)];
                case 14:
                    lcplStr = lcplZipData.toString("utf8");
                    lcplJson = global.JSON.parse(lcplStr);
                    lcpl = serializable_1.TaJsonDeserialize(lcplJson, lcp_1.LCP);
                    lcpl.ZipPath = lcplZipPath;
                    lcpl.JsonSource = lcplStr;
                    lcpl.init();
                    publication.LCP = lcpl;
                    mime = "application/vnd.readium.lcp.license.v1.0+json";
                    publication.AddLink(mime, ["license"], lcpl.ZipPath, undefined);
                    _a.label = 15;
                case 15:
                    encZipPath = "META-INF/encryption.xml";
                    return [4, zipHasEntry_1.zipHasEntry(zip, encZipPath, undefined)];
                case 16:
                    has = _a.sent();
                    if (!has) return [3, 25];
                    encryptionXmlZipStream_ = void 0;
                    _a.label = 17;
                case 17:
                    _a.trys.push([17, 19, , 20]);
                    return [4, zip.entryStreamPromise(encZipPath)];
                case 18:
                    encryptionXmlZipStream_ = _a.sent();
                    return [3, 20];
                case 19:
                    err_6 = _a.sent();
                    debug(err_6);
                    return [2, Promise.reject(err_6)];
                case 20:
                    encryptionXmlZipStream = encryptionXmlZipStream_.stream;
                    encryptionXmlZipData = void 0;
                    _a.label = 21;
                case 21:
                    _a.trys.push([21, 23, , 24]);
                    return [4, BufferUtils_1.streamToBufferPromise(encryptionXmlZipStream)];
                case 22:
                    encryptionXmlZipData = _a.sent();
                    return [3, 24];
                case 23:
                    err_7 = _a.sent();
                    debug(err_7);
                    return [2, Promise.reject(err_7)];
                case 24:
                    encryptionXmlStr = encryptionXmlZipData.toString("utf8");
                    encryptionXmlDoc = new xmldom.DOMParser().parseFromString(encryptionXmlStr);
                    encryption = xml_js_mapper_1.XML.deserialize(encryptionXmlDoc, encryption_1.Encryption);
                    encryption.ZipPath = encZipPath;
                    _a.label = 25;
                case 25:
                    containerZipPath = "META-INF/container.xml";
                    _a.label = 26;
                case 26:
                    _a.trys.push([26, 28, , 29]);
                    return [4, zip.entryStreamPromise(containerZipPath)];
                case 27:
                    containerXmlZipStream_ = _a.sent();
                    return [3, 29];
                case 28:
                    err_8 = _a.sent();
                    debug(err_8);
                    return [2, Promise.reject(err_8)];
                case 29:
                    containerXmlZipStream = containerXmlZipStream_.stream;
                    _a.label = 30;
                case 30:
                    _a.trys.push([30, 32, , 33]);
                    return [4, BufferUtils_1.streamToBufferPromise(containerXmlZipStream)];
                case 31:
                    containerXmlZipData = _a.sent();
                    return [3, 33];
                case 32:
                    err_9 = _a.sent();
                    debug(err_9);
                    return [2, Promise.reject(err_9)];
                case 33:
                    containerXmlStr = containerXmlZipData.toString("utf8");
                    containerXmlDoc = new xmldom.DOMParser().parseFromString(containerXmlStr);
                    container = xml_js_mapper_1.XML.deserialize(containerXmlDoc, container_1.Container);
                    container.ZipPath = containerZipPath;
                    rootfile = container.Rootfile[0];
                    rootfilePathDecoded = rootfile.PathDecoded;
                    if (!rootfilePathDecoded) {
                        return [2, Promise.reject("?!rootfile.PathDecoded")];
                    }
                    return [4, epub_daisy_common_1.getOpf(zip, rootfilePathDecoded, rootfile.Path)];
                case 34:
                    opf = _a.sent();
                    epub_daisy_common_1.addLanguage(publication, opf);
                    epub_daisy_common_1.addTitle(publication, rootfile, opf);
                    epub_daisy_common_1.addIdentifier(publication, opf);
                    epub_daisy_common_1.addOtherMetadata(publication, rootfile, opf);
                    epub_daisy_common_1.setPublicationDirection(publication, opf);
                    epub_daisy_common_1.findContributorInMeta(publication, rootfile, opf);
                    return [4, epub_daisy_common_1.fillSpineAndResource(publication, rootfile, opf, zip, addLinkData)];
                case 35:
                    _a.sent();
                    return [4, addRendition(publication, opf, zip)];
                case 36:
                    _a.sent();
                    return [4, addCoverRel(publication, rootfile, opf, zip)];
                case 37:
                    _a.sent();
                    if (encryption) {
                        fillEncryptionInfo(publication, encryption, lcpl);
                    }
                    return [4, fillTOCFromNavDoc(publication, zip)];
                case 38:
                    _a.sent();
                    if (!(!publication.TOC || !publication.TOC.length)) return [3, 41];
                    ncx = void 0;
                    if (!(opf.Manifest && opf.Spine.Toc)) return [3, 40];
                    ncxManItem = opf.Manifest.find(function (manifestItem) {
                        return manifestItem.ID === opf.Spine.Toc;
                    });
                    if (!ncxManItem) return [3, 40];
                    return [4, epub_daisy_common_1.getNcx(ncxManItem, opf, zip)];
                case 39:
                    ncx = _a.sent();
                    _a.label = 40;
                case 40:
                    epub_daisy_common_1.fillTOC(publication, opf, ncx);
                    _a.label = 41;
                case 41:
                    if (!(!publication.PageList && publication.Resources)) return [3, 43];
                    pageMapLink = publication.Resources.find(function (item) {
                        return item.TypeLink === "application/oebps-page-map+xml";
                    });
                    if (!pageMapLink) return [3, 43];
                    return [4, fillPageListFromAdobePageMap(publication, zip, pageMapLink)];
                case 42:
                    _a.sent();
                    _a.label = 43;
                case 43:
                    fillCalibreSerieInfo(publication, opf);
                    epub_daisy_common_1.fillSubject(publication, opf);
                    epub_daisy_common_1.fillPublicationDate(publication, rootfile, opf);
                    return [2, publication];
            }
        });
    });
}
exports.EpubParsePromise = EpubParsePromise;
function getAllMediaOverlays(publication) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var mos, links, _i, links_1, link, mo, err_10;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mos = [];
                    links = [].
                        concat(publication.Spine ? publication.Spine : []).
                        concat(publication.Resources ? publication.Resources : []);
                    _i = 0, links_1 = links;
                    _a.label = 1;
                case 1:
                    if (!(_i < links_1.length)) return [3, 7];
                    link = links_1[_i];
                    if (!link.MediaOverlays) return [3, 6];
                    mo = link.MediaOverlays;
                    if (!!mo.initialized) return [3, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, epub_daisy_common_1.lazyLoadMediaOverlays(publication, mo)];
                case 3:
                    _a.sent();
                    return [3, 5];
                case 4:
                    err_10 = _a.sent();
                    return [2, Promise.reject(err_10)];
                case 5:
                    mos.push(mo);
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3, 1];
                case 7: return [2, Promise.resolve(mos)];
            }
        });
    });
}
exports.getAllMediaOverlays = getAllMediaOverlays;
function getMediaOverlay(publication, spineHref) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var links, _i, links_2, link, mo, err_11;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    links = [].
                        concat(publication.Spine ? publication.Spine : []).
                        concat(publication.Resources ? publication.Resources : []);
                    _i = 0, links_2 = links;
                    _a.label = 1;
                case 1:
                    if (!(_i < links_2.length)) return [3, 7];
                    link = links_2[_i];
                    if (!(link.MediaOverlays && link.Href.indexOf(spineHref) >= 0)) return [3, 6];
                    mo = link.MediaOverlays;
                    if (!!mo.initialized) return [3, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, epub_daisy_common_1.lazyLoadMediaOverlays(publication, mo)];
                case 3:
                    _a.sent();
                    return [3, 5];
                case 4:
                    err_11 = _a.sent();
                    return [2, Promise.reject(err_11)];
                case 5: return [2, Promise.resolve(mo)];
                case 6:
                    _i++;
                    return [3, 1];
                case 7: return [2, Promise.reject("No Media Overlays " + spineHref)];
            }
        });
    });
}
exports.getMediaOverlay = getMediaOverlay;
var addRelAndPropertiesToLink = function (publication, link, linkEpub, opf) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var spineProperties;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!linkEpub.Properties) return [3, 2];
                return [4, addToLinkFromProperties(publication, link, linkEpub.Properties)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                spineProperties = findPropertiesInSpineForManifest(linkEpub, opf);
                if (!spineProperties) return [3, 4];
                return [4, addToLinkFromProperties(publication, link, spineProperties)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2];
        }
    });
}); };
var addToLinkFromProperties = function (publication, link, propertiesString) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var properties, propertiesStruct, _i, properties_1, p, _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                properties = epub_daisy_common_1.parseSpaceSeparatedString(propertiesString);
                propertiesStruct = new metadata_properties_1.Properties();
                _i = 0, properties_1 = properties;
                _b.label = 1;
            case 1:
                if (!(_i < properties_1.length)) return [3, 31];
                p = properties_1[_i];
                _a = p;
                switch (_a) {
                    case "cover-image": return [3, 2];
                    case "nav": return [3, 4];
                    case "scripted": return [3, 5];
                    case "mathml": return [3, 6];
                    case "onix-record": return [3, 7];
                    case "svg": return [3, 8];
                    case "xmp-record": return [3, 9];
                    case "remote-resources": return [3, 10];
                    case "page-spread-left": return [3, 11];
                    case "page-spread-right": return [3, 12];
                    case "page-spread-center": return [3, 13];
                    case "rendition:spread-none": return [3, 14];
                    case "rendition:spread-auto": return [3, 15];
                    case "rendition:spread-landscape": return [3, 16];
                    case "rendition:spread-portrait": return [3, 17];
                    case "rendition:spread-both": return [3, 18];
                    case "rendition:layout-reflowable": return [3, 19];
                    case "rendition:layout-pre-paginated": return [3, 20];
                    case "rendition:orientation-auto": return [3, 21];
                    case "rendition:orientation-landscape": return [3, 22];
                    case "rendition:orientation-portrait": return [3, 23];
                    case "rendition:flow-auto": return [3, 24];
                    case "rendition:flow-paginated": return [3, 25];
                    case "rendition:flow-scrolled-continuous": return [3, 26];
                    case "rendition:flow-scrolled-doc": return [3, 27];
                }
                return [3, 28];
            case 2:
                link.AddRel("cover");
                return [4, exports.addCoverDimensions(publication, link)];
            case 3:
                _b.sent();
                return [3, 29];
            case 4:
                {
                    link.AddRel("contents");
                    return [3, 29];
                }
                _b.label = 5;
            case 5:
                {
                    if (!propertiesStruct.Contains) {
                        propertiesStruct.Contains = [];
                    }
                    propertiesStruct.Contains.push("js");
                    return [3, 29];
                }
                _b.label = 6;
            case 6:
                {
                    if (!propertiesStruct.Contains) {
                        propertiesStruct.Contains = [];
                    }
                    propertiesStruct.Contains.push("mathml");
                    return [3, 29];
                }
                _b.label = 7;
            case 7:
                {
                    if (!propertiesStruct.Contains) {
                        propertiesStruct.Contains = [];
                    }
                    propertiesStruct.Contains.push("onix");
                    return [3, 29];
                }
                _b.label = 8;
            case 8:
                {
                    if (!propertiesStruct.Contains) {
                        propertiesStruct.Contains = [];
                    }
                    propertiesStruct.Contains.push("svg");
                    return [3, 29];
                }
                _b.label = 9;
            case 9:
                {
                    if (!propertiesStruct.Contains) {
                        propertiesStruct.Contains = [];
                    }
                    propertiesStruct.Contains.push("xmp");
                    return [3, 29];
                }
                _b.label = 10;
            case 10:
                {
                    if (!propertiesStruct.Contains) {
                        propertiesStruct.Contains = [];
                    }
                    propertiesStruct.Contains.push("remote-resources");
                    return [3, 29];
                }
                _b.label = 11;
            case 11:
                {
                    propertiesStruct.Page = metadata_properties_1.PageEnum.Left;
                    return [3, 29];
                }
                _b.label = 12;
            case 12:
                {
                    propertiesStruct.Page = metadata_properties_1.PageEnum.Right;
                    return [3, 29];
                }
                _b.label = 13;
            case 13:
                {
                    propertiesStruct.Page = metadata_properties_1.PageEnum.Center;
                    return [3, 29];
                }
                _b.label = 14;
            case 14:
                {
                    propertiesStruct.Spread = metadata_properties_1.SpreadEnum.None;
                    return [3, 29];
                }
                _b.label = 15;
            case 15:
                {
                    propertiesStruct.Spread = metadata_properties_1.SpreadEnum.Auto;
                    return [3, 29];
                }
                _b.label = 16;
            case 16:
                {
                    propertiesStruct.Spread = metadata_properties_1.SpreadEnum.Landscape;
                    return [3, 29];
                }
                _b.label = 17;
            case 17:
                {
                    propertiesStruct.Spread = metadata_properties_1.SpreadEnum.Both;
                    return [3, 29];
                }
                _b.label = 18;
            case 18:
                {
                    propertiesStruct.Spread = metadata_properties_1.SpreadEnum.Both;
                    return [3, 29];
                }
                _b.label = 19;
            case 19:
                {
                    propertiesStruct.Layout = metadata_properties_1.LayoutEnum.Reflowable;
                    return [3, 29];
                }
                _b.label = 20;
            case 20:
                {
                    propertiesStruct.Layout = metadata_properties_1.LayoutEnum.Fixed;
                    return [3, 29];
                }
                _b.label = 21;
            case 21:
                {
                    propertiesStruct.Orientation = metadata_properties_1.OrientationEnum.Auto;
                    return [3, 29];
                }
                _b.label = 22;
            case 22:
                {
                    propertiesStruct.Orientation = metadata_properties_1.OrientationEnum.Landscape;
                    return [3, 29];
                }
                _b.label = 23;
            case 23:
                {
                    propertiesStruct.Orientation = metadata_properties_1.OrientationEnum.Portrait;
                    return [3, 29];
                }
                _b.label = 24;
            case 24:
                {
                    propertiesStruct.Overflow = metadata_properties_1.OverflowEnum.Auto;
                    return [3, 29];
                }
                _b.label = 25;
            case 25:
                {
                    propertiesStruct.Overflow = metadata_properties_1.OverflowEnum.Paginated;
                    return [3, 29];
                }
                _b.label = 26;
            case 26:
                {
                    propertiesStruct.Overflow = metadata_properties_1.OverflowEnum.ScrolledContinuous;
                    return [3, 29];
                }
                _b.label = 27;
            case 27:
                {
                    propertiesStruct.Overflow = metadata_properties_1.OverflowEnum.Scrolled;
                    return [3, 29];
                }
                _b.label = 28;
            case 28:
                {
                    return [3, 29];
                }
                _b.label = 29;
            case 29:
                if (propertiesStruct.Layout ||
                    propertiesStruct.Orientation ||
                    propertiesStruct.Overflow ||
                    propertiesStruct.Page ||
                    propertiesStruct.Spread ||
                    (propertiesStruct.Contains && propertiesStruct.Contains.length)) {
                    link.Properties = propertiesStruct;
                }
                _b.label = 30;
            case 30:
                _i++;
                return [3, 1];
            case 31: return [2];
        }
    });
}); };
var addMediaOverlay = function (link, linkEpub, opf, zip) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var meta, manItemSmil;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!linkEpub.MediaOverlay) return [3, 2];
                meta = epub_daisy_common_1.findMetaByRefineAndProperty(opf, linkEpub.MediaOverlay, "media:duration");
                if (meta) {
                    link.Duration = media_overlay_1.timeStrToSeconds(meta.Data);
                }
                manItemSmil = opf.Manifest.find(function (mi) {
                    if (mi.ID === linkEpub.MediaOverlay) {
                        return true;
                    }
                    return false;
                });
                if (!manItemSmil) return [3, 2];
                return [4, epub_daisy_common_1.addMediaOverlaySMIL(link, manItemSmil, opf, zip)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2];
        }
    });
}); };
var addRendition = function (publication, opf, zip) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var rendition_1, displayOptionsZipPath, has, displayOptionsZipStream_, err_12, displayOptionsZipStream, displayOptionsZipData, err_13, displayOptionsStr, displayOptionsDoc, displayOptions, renditionPlatformAll_1, renditionPlatformIpad_1, renditionPlatformIphone_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(opf.Metadata && opf.Metadata.Meta && opf.Metadata.Meta.length)) return [3, 15];
                rendition_1 = new metadata_properties_1.Properties();
                opf.Metadata.Meta.forEach(function (meta) {
                    switch (meta.Property) {
                        case "rendition:layout": {
                            switch (meta.Data) {
                                case "pre-paginated": {
                                    rendition_1.Layout = metadata_properties_1.LayoutEnum.Fixed;
                                    break;
                                }
                                case "reflowable": {
                                    rendition_1.Layout = metadata_properties_1.LayoutEnum.Reflowable;
                                    break;
                                }
                            }
                            break;
                        }
                        case "rendition:orientation": {
                            switch (meta.Data) {
                                case "auto": {
                                    rendition_1.Orientation = metadata_properties_1.OrientationEnum.Auto;
                                    break;
                                }
                                case "landscape": {
                                    rendition_1.Orientation = metadata_properties_1.OrientationEnum.Landscape;
                                    break;
                                }
                                case "portrait": {
                                    rendition_1.Orientation = metadata_properties_1.OrientationEnum.Portrait;
                                    break;
                                }
                            }
                            break;
                        }
                        case "rendition:spread": {
                            switch (meta.Data) {
                                case "auto": {
                                    rendition_1.Spread = metadata_properties_1.SpreadEnum.Auto;
                                    break;
                                }
                                case "both": {
                                    rendition_1.Spread = metadata_properties_1.SpreadEnum.Both;
                                    break;
                                }
                                case "none": {
                                    rendition_1.Spread = metadata_properties_1.SpreadEnum.None;
                                    break;
                                }
                                case "landscape": {
                                    rendition_1.Spread = metadata_properties_1.SpreadEnum.Landscape;
                                    break;
                                }
                                case "portrait": {
                                    rendition_1.Spread = metadata_properties_1.SpreadEnum.Both;
                                    break;
                                }
                            }
                            break;
                        }
                        case "rendition:flow": {
                            switch (meta.Data) {
                                case "auto": {
                                    rendition_1.Overflow = metadata_properties_1.OverflowEnum.Auto;
                                    break;
                                }
                                case "paginated": {
                                    rendition_1.Overflow = metadata_properties_1.OverflowEnum.Paginated;
                                    break;
                                }
                                case "scrolled": {
                                    rendition_1.Overflow = metadata_properties_1.OverflowEnum.Scrolled;
                                    break;
                                }
                                case "scrolled-continuous": {
                                    rendition_1.Overflow = metadata_properties_1.OverflowEnum.ScrolledContinuous;
                                    break;
                                }
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                });
                if (!(!rendition_1.Layout || !rendition_1.Orientation)) return [3, 14];
                displayOptionsZipPath = "META-INF/com.apple.ibooks.display-options.xml";
                return [4, zipHasEntry_1.zipHasEntry(zip, displayOptionsZipPath, undefined)];
            case 1:
                has = _a.sent();
                if (!has) return [3, 2];
                debug("Info: found iBooks display-options XML");
                return [3, 4];
            case 2:
                displayOptionsZipPath = "META-INF/com.kobobooks.display-options.xml";
                return [4, zipHasEntry_1.zipHasEntry(zip, displayOptionsZipPath, undefined)];
            case 3:
                has = _a.sent();
                if (has) {
                    debug("Info: found Kobo display-options XML");
                }
                _a.label = 4;
            case 4:
                if (!!has) return [3, 5];
                debug("Info: not found iBooks or Kobo display-options XML");
                return [3, 14];
            case 5:
                displayOptionsZipStream_ = void 0;
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4, zip.entryStreamPromise(displayOptionsZipPath)];
            case 7:
                displayOptionsZipStream_ = _a.sent();
                return [3, 9];
            case 8:
                err_12 = _a.sent();
                debug(err_12);
                return [3, 9];
            case 9:
                if (!displayOptionsZipStream_) return [3, 14];
                displayOptionsZipStream = displayOptionsZipStream_.stream;
                displayOptionsZipData = void 0;
                _a.label = 10;
            case 10:
                _a.trys.push([10, 12, , 13]);
                return [4, BufferUtils_1.streamToBufferPromise(displayOptionsZipStream)];
            case 11:
                displayOptionsZipData = _a.sent();
                return [3, 13];
            case 12:
                err_13 = _a.sent();
                debug(err_13);
                return [3, 13];
            case 13:
                if (displayOptionsZipData) {
                    try {
                        displayOptionsStr = displayOptionsZipData.toString("utf8");
                        displayOptionsDoc = new xmldom.DOMParser().parseFromString(displayOptionsStr);
                        displayOptions = xml_js_mapper_1.XML.deserialize(displayOptionsDoc, display_options_1.DisplayOptions);
                        displayOptions.ZipPath = displayOptionsZipPath;
                        if (displayOptions && displayOptions.Platforms) {
                            renditionPlatformAll_1 = new metadata_properties_1.Properties();
                            renditionPlatformIpad_1 = new metadata_properties_1.Properties();
                            renditionPlatformIphone_1 = new metadata_properties_1.Properties();
                            displayOptions.Platforms.forEach(function (platform) {
                                if (platform.Options) {
                                    platform.Options.forEach(function (option) {
                                        if (!rendition_1.Layout) {
                                            if (option.Name === "fixed-layout") {
                                                if (option.Value === "true") {
                                                    rendition_1.Layout = metadata_properties_1.LayoutEnum.Fixed;
                                                }
                                                else {
                                                    rendition_1.Layout = metadata_properties_1.LayoutEnum.Reflowable;
                                                }
                                            }
                                        }
                                        if (!rendition_1.Orientation) {
                                            if (option.Name === "orientation-lock") {
                                                var rend = platform.Name === "*" ? renditionPlatformAll_1 :
                                                    (platform.Name === "ipad" ? renditionPlatformIpad_1 :
                                                        (platform.Name === "iphone" ? renditionPlatformIphone_1 :
                                                            renditionPlatformAll_1));
                                                switch (option.Value) {
                                                    case "none": {
                                                        rend.Orientation = metadata_properties_1.OrientationEnum.Auto;
                                                        break;
                                                    }
                                                    case "landscape-only": {
                                                        rend.Orientation = metadata_properties_1.OrientationEnum.Landscape;
                                                        break;
                                                    }
                                                    case "portrait-only": {
                                                        rend.Orientation = metadata_properties_1.OrientationEnum.Portrait;
                                                        break;
                                                    }
                                                    default: {
                                                        rend.Orientation = metadata_properties_1.OrientationEnum.Auto;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                            if (renditionPlatformAll_1.Orientation) {
                                rendition_1.Orientation = renditionPlatformAll_1.Orientation;
                            }
                            else if (renditionPlatformIpad_1.Orientation) {
                                rendition_1.Orientation = renditionPlatformIpad_1.Orientation;
                            }
                            else if (renditionPlatformIphone_1.Orientation) {
                                rendition_1.Orientation = renditionPlatformIphone_1.Orientation;
                            }
                        }
                    }
                    catch (err) {
                        debug(err);
                    }
                }
                _a.label = 14;
            case 14:
                if (rendition_1.Layout || rendition_1.Orientation || rendition_1.Overflow || rendition_1.Page || rendition_1.Spread) {
                    publication.Metadata.Rendition = rendition_1;
                }
                _a.label = 15;
            case 15: return [2];
        }
    });
}); };
var addLinkData = function (publication, rootfile, opf, zip, linkItem, item) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!rootfile) return [3, 2];
                return [4, addRelAndPropertiesToLink(publication, linkItem, item, opf)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4, addMediaOverlay(linkItem, item, opf, zip)];
            case 3:
                _a.sent();
                return [2];
        }
    });
}); };
var fillEncryptionInfo = function (publication, encryption, lcp) {
    encryption.EncryptedData.forEach(function (encInfo) {
        var encrypted = new metadata_encrypted_1.Encrypted();
        encrypted.Algorithm = encInfo.EncryptionMethod.Algorithm;
        if (lcp &&
            encrypted.Algorithm !== "http://www.idpf.org/2008/embedding" &&
            encrypted.Algorithm !== "http://ns.adobe.com/pdf/enc#RC") {
            encrypted.Profile = lcp.Encryption.Profile;
            encrypted.Scheme = "http://readium.org/2014/01/lcp";
        }
        if (encInfo.EncryptionProperties && encInfo.EncryptionProperties.length) {
            encInfo.EncryptionProperties.forEach(function (prop) {
                if (prop.Compression) {
                    if (prop.Compression.OriginalLength) {
                        encrypted.OriginalLength = parseFloat(prop.Compression.OriginalLength);
                    }
                    if (prop.Compression.Method === "8") {
                        encrypted.Compression = "deflate";
                    }
                    else {
                        encrypted.Compression = "none";
                    }
                }
            });
        }
        if (publication.Resources) {
            publication.Resources.forEach(function (l) {
                var filePath = l.Href;
                if (filePath === encInfo.CipherData.CipherReference.URI) {
                    if (!l.Properties) {
                        l.Properties = new metadata_properties_1.Properties();
                    }
                    l.Properties.Encrypted = encrypted;
                }
            });
        }
        if (publication.Spine) {
            publication.Spine.forEach(function (l) {
                var filePath = l.Href;
                if (filePath === encInfo.CipherData.CipherReference.URI) {
                    if (!l.Properties) {
                        l.Properties = new metadata_properties_1.Properties();
                    }
                    l.Properties.Encrypted = encrypted;
                }
            });
        }
    });
};
var fillPageListFromAdobePageMap = function (publication, zip, l) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var pageMapContent, pageMapXmlDoc, pages, i, page, link, href, title, hrefDecoded, zipPath;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!l.HrefDecoded) {
                    return [2];
                }
                return [4, epub_daisy_common_1.loadFileStrFromZipPath(l.Href, l.HrefDecoded, zip)];
            case 1:
                pageMapContent = _a.sent();
                if (!pageMapContent) {
                    return [2];
                }
                pageMapXmlDoc = new xmldom.DOMParser().parseFromString(pageMapContent);
                pages = pageMapXmlDoc.getElementsByTagName("page");
                if (pages && pages.length) {
                    for (i = 0; i < pages.length; i += 1) {
                        page = pages.item(i);
                        link = new publication_link_1.Link();
                        href = page.getAttribute("href");
                        title = page.getAttribute("name");
                        if (href === null || title === null) {
                            continue;
                        }
                        if (!publication.PageList) {
                            publication.PageList = [];
                        }
                        hrefDecoded = decodeURI_1.tryDecodeURI(href);
                        if (!hrefDecoded) {
                            continue;
                        }
                        zipPath = path.join(path.dirname(l.HrefDecoded), hrefDecoded)
                            .replace(/\\/g, "/");
                        link.setHrefDecoded(zipPath);
                        link.Title = title;
                        publication.PageList.push(link);
                    }
                }
                return [2];
        }
    });
}); };
var fillCalibreSerieInfo = function (publication, opf) {
    var serie;
    var seriePosition;
    if (opf.Metadata && opf.Metadata.Meta && opf.Metadata.Meta.length) {
        opf.Metadata.Meta.forEach(function (m) {
            if (m.Name === "calibre:series") {
                serie = m.Content;
            }
            if (m.Name === "calibre:series_index") {
                seriePosition = parseFloat(m.Content);
            }
        });
    }
    if (serie) {
        var contributor = new metadata_contributor_1.Contributor();
        contributor.Name = serie;
        if (seriePosition) {
            contributor.Position = seriePosition;
        }
        if (!publication.Metadata.BelongsTo) {
            publication.Metadata.BelongsTo = new metadata_belongsto_1.BelongsTo();
        }
        if (!publication.Metadata.BelongsTo.Series) {
            publication.Metadata.BelongsTo.Series = [];
        }
        publication.Metadata.BelongsTo.Series.push(contributor);
    }
};
var fillTOCFromNavDoc = function (publication, zip) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var navLink, navLinkHrefDecoded, has, zipEntries, _i, zipEntries_2, zipEntry, navDocZipStream_, err_14, navDocZipStream, navDocZipData, err_15, navDocStr, navXmlDoc, select, navs;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                navLink = publication.GetNavDoc();
                if (!navLink) {
                    return [2];
                }
                navLinkHrefDecoded = navLink.HrefDecoded;
                if (!navLinkHrefDecoded) {
                    debug("!?navLink.HrefDecoded");
                    return [2];
                }
                return [4, zipHasEntry_1.zipHasEntry(zip, navLinkHrefDecoded, navLink.Href)];
            case 1:
                has = _a.sent();
                if (!!has) return [3, 3];
                debug("NOT IN ZIP (fillTOCFromNavDoc): " + navLink.Href + " --- " + navLinkHrefDecoded);
                return [4, zip.getEntries()];
            case 2:
                zipEntries = _a.sent();
                for (_i = 0, zipEntries_2 = zipEntries; _i < zipEntries_2.length; _i++) {
                    zipEntry = zipEntries_2[_i];
                    debug(zipEntry);
                }
                return [2];
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4, zip.entryStreamPromise(navLinkHrefDecoded)];
            case 4:
                navDocZipStream_ = _a.sent();
                return [3, 6];
            case 5:
                err_14 = _a.sent();
                debug(err_14);
                return [2, Promise.reject(err_14)];
            case 6:
                navDocZipStream = navDocZipStream_.stream;
                _a.label = 7;
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4, BufferUtils_1.streamToBufferPromise(navDocZipStream)];
            case 8:
                navDocZipData = _a.sent();
                return [3, 10];
            case 9:
                err_15 = _a.sent();
                debug(err_15);
                return [2, Promise.reject(err_15)];
            case 10:
                navDocStr = navDocZipData.toString("utf8");
                navXmlDoc = new xmldom.DOMParser().parseFromString(navDocStr);
                select = xpath.useNamespaces({
                    epub: "http://www.idpf.org/2007/ops",
                    xhtml: "http://www.w3.org/1999/xhtml",
                });
                navs = select("/xhtml:html/xhtml:body//xhtml:nav", navXmlDoc);
                if (navs && navs.length) {
                    navs.forEach(function (navElement) {
                        var epubType = select("@epub:type", navElement);
                        if (epubType && epubType.length) {
                            var olElem = select("xhtml:ol", navElement);
                            var rolesString = epubType[0].value;
                            var rolesArray = epub_daisy_common_1.parseSpaceSeparatedString(rolesString);
                            if (rolesArray.length) {
                                for (var _i = 0, rolesArray_1 = rolesArray; _i < rolesArray_1.length; _i++) {
                                    var role = rolesArray_1[_i];
                                    switch (role) {
                                        case "toc": {
                                            publication.TOC = [];
                                            fillTOCFromNavDocWithOL(select, olElem, publication.TOC, navLinkHrefDecoded);
                                            break;
                                        }
                                        case "page-list": {
                                            publication.PageList = [];
                                            fillTOCFromNavDocWithOL(select, olElem, publication.PageList, navLinkHrefDecoded);
                                            break;
                                        }
                                        case "landmarks": {
                                            publication.Landmarks = [];
                                            fillTOCFromNavDocWithOL(select, olElem, publication.Landmarks, navLinkHrefDecoded);
                                            break;
                                        }
                                        case "lot": {
                                            publication.LOT = [];
                                            fillTOCFromNavDocWithOL(select, olElem, publication.LOT, navLinkHrefDecoded);
                                            break;
                                        }
                                        case "loa": {
                                            publication.LOA = [];
                                            fillTOCFromNavDocWithOL(select, olElem, publication.LOA, navLinkHrefDecoded);
                                            break;
                                        }
                                        case "loi": {
                                            publication.LOI = [];
                                            fillTOCFromNavDocWithOL(select, olElem, publication.LOI, navLinkHrefDecoded);
                                            break;
                                        }
                                        case "lov": {
                                            publication.LOV = [];
                                            fillTOCFromNavDocWithOL(select, olElem, publication.LOV, navLinkHrefDecoded);
                                            break;
                                        }
                                        default: {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
                return [2];
        }
    });
}); };
var fillTOCFromNavDocWithOL = function (select, olElems, children, navDocPath) {
    olElems.forEach(function (olElem) {
        var liElems = select("xhtml:li", olElem);
        if (liElems && liElems.length) {
            liElems.forEach(function (liElem) {
                var link = new publication_link_1.Link();
                children.push(link);
                var aElems = select("xhtml:a", liElem);
                if (aElems && aElems.length > 0) {
                    var epubType = select("@epub:type", aElems[0]);
                    if (epubType && epubType.length) {
                        var rolesString = epubType[0].value;
                        var rolesArray = epub_daisy_common_1.parseSpaceSeparatedString(rolesString);
                        if (rolesArray.length) {
                            link.AddRels(rolesArray);
                        }
                    }
                    var aHref = select("@href", aElems[0]);
                    if (aHref && aHref.length) {
                        var val = aHref[0].value;
                        var valDecoded = decodeURI_1.tryDecodeURI(val);
                        if (!valDecoded) {
                            debug("!?valDecoded");
                            return;
                        }
                        if (val[0] === "#") {
                            valDecoded = path.basename(navDocPath) + valDecoded;
                        }
                        var zipPath = path.join(path.dirname(navDocPath), valDecoded)
                            .replace(/\\/g, "/");
                        link.setHrefDecoded(zipPath);
                    }
                    var aText = aElems[0].textContent;
                    if (aText && aText.length) {
                        aText = aText.trim();
                        aText = aText.replace(/\s\s+/g, " ");
                        link.Title = aText;
                    }
                }
                else {
                    var liFirstChild = select("xhtml:*[1]", liElem);
                    if (liFirstChild && liFirstChild.length && liFirstChild[0].textContent) {
                        link.Title = liFirstChild[0].textContent.trim();
                    }
                }
                var olElemsNext = select("xhtml:ol", liElem);
                if (olElemsNext && olElemsNext.length) {
                    if (!link.Children) {
                        link.Children = [];
                    }
                    fillTOCFromNavDocWithOL(select, olElemsNext, link.Children, navDocPath);
                }
            });
        }
    });
};
var addCoverRel = function (publication, rootfile, opf, zip) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var coverID, manifestInfo, err_16, href_1, linky;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (opf.Metadata && opf.Metadata.Meta && opf.Metadata.Meta.length) {
                    opf.Metadata.Meta.find(function (meta) {
                        if (meta.Name === "cover") {
                            coverID = meta.Content;
                            return true;
                        }
                        return false;
                    });
                }
                if (!coverID) return [3, 6];
                manifestInfo = void 0;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, epub_daisy_common_1.findInManifestByID(publication, rootfile, opf, coverID, zip, addLinkData)];
            case 2:
                manifestInfo = _a.sent();
                return [3, 4];
            case 3:
                err_16 = _a.sent();
                debug(err_16);
                return [2];
            case 4:
                if (!(manifestInfo && manifestInfo.Href && publication.Resources && publication.Resources.length)) return [3, 6];
                href_1 = manifestInfo.Href;
                linky = publication.Resources.find(function (item) {
                    if (item.Href === href_1) {
                        return true;
                    }
                    return false;
                });
                if (!linky) return [3, 6];
                linky.AddRel("cover");
                return [4, exports.addCoverDimensions(publication, linky)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2];
        }
    });
}); };
var findPropertiesInSpineForManifest = function (linkEpub, opf) {
    if (opf.Spine && opf.Spine.Items && opf.Spine.Items.length) {
        var it = opf.Spine.Items.find(function (item) {
            if (item.IDref === linkEpub.ID) {
                return true;
            }
            return false;
        });
        if (it && it.Properties) {
            return it.Properties;
        }
    }
    return undefined;
};
//# sourceMappingURL=epub.js.map