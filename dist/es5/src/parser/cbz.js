"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CbzParsePromise = exports.isCBZPublication = void 0;
var tslib_1 = require("tslib");
var mime = require("mime-types");
var path = require("path");
var slugify = require("slugify");
var xmldom = require("xmldom");
var metadata_1 = require("../models/metadata");
var metadata_contributor_1 = require("../models/metadata-contributor");
var publication_1 = require("../models/publication");
var publication_link_1 = require("../models/publication-link");
var BufferUtils_1 = require("r2-utils-rn/dist/es5/src/_utils/stream/BufferUtils");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var zipFactory_1 = require("r2-utils-rn/dist/es5/src/_utils/zip/zipFactory");
var decodeURI_1 = require("../_utils/decodeURI");
var zipHasEntry_1 = require("../_utils/zipHasEntry");
var comicrack_1 = require("./comicrack/comicrack");
var epub_1 = require("./epub");
function isCBZPublication(filePath) {
    var fileName = path.basename(filePath);
    var ext = path.extname(fileName).toLowerCase();
    var cbz = /\.cbz$/.test(ext);
    return cbz;
}
exports.isCBZPublication = isCBZPublication;
function CbzParsePromise(filePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var zip, err_1, publication, comicInfoEntryName, entries, err_2, _i, entries_1, entryName, link, mediaType, _b, err_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, zipFactory_1.zipLoadPromise(filePath)];
                case 1:
                    zip = _a.sent();
                    return [3, 3];
                case 2:
                    err_1 = _a.sent();
                    return [2, Promise.reject(err_1)];
                case 3:
                    if (!zip.hasEntries()) {
                        return [2, Promise.reject("CBZ zip empty")];
                    }
                    publication = new publication_1.Publication();
                    publication.Context = ["https://readium.org/webpub-manifest/context.jsonld"];
                    publication.Metadata = new metadata_1.Metadata();
                    publication.Metadata.RDFType = "http://schema.org/ComicIssue";
                    publication.Metadata.Identifier = filePathToTitle(filePath);
                    publication.AddToInternal("type", "cbz");
                    publication.AddToInternal("zip", zip);
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4, zip.getEntries()];
                case 5:
                    entries = _a.sent();
                    return [3, 7];
                case 6:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [2, Promise.reject("Problem getting CBZ zip entries")];
                case 7:
                    if (entries) {
                        for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                            entryName = entries_1[_i];
                            link = new publication_link_1.Link();
                            link.setHrefDecoded(entryName);
                            mediaType = mime.lookup(entryName);
                            if (mediaType) {
                                link.TypeLink = mediaType;
                            }
                            else {
                                console.log("!!!!!! NO MEDIA TYPE?!");
                            }
                            if (link.TypeLink && link.TypeLink.startsWith("image/")) {
                                if (!publication.Spine) {
                                    publication.Spine = [];
                                }
                                publication.Spine.push(link);
                            }
                            else if (entryName.endsWith("ComicInfo.xml")) {
                                comicInfoEntryName = entryName;
                            }
                        }
                    }
                    if (!publication.Metadata.Title) {
                        publication.Metadata.Title = path.basename(filePath);
                    }
                    if (!comicInfoEntryName) return [3, 11];
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4, comicRackMetadata(zip, comicInfoEntryName, publication)];
                case 9:
                    _b = _a.sent();
                    console.log(_b);
                    return [3, 11];
                case 10:
                    err_3 = _a.sent();
                    console.log(err_3);
                    return [3, 11];
                case 11: return [2, publication];
            }
        });
    });
}
exports.CbzParsePromise = CbzParsePromise;
var filePathToTitle = function (filePath) {
    var fileName = path.basename(filePath);
    return slugify(fileName, "_").replace(/[\.]/g, "_");
};
var comicRackMetadata = function (zip, entryName, publication) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var entryNameDecoded, has, zipEntries, _i, zipEntries_1, zipEntry, comicZipStream_, err_4, comicZipStream, comicZipData, err_5, comicXmlStr, comicXmlDoc, comicMeta, cont, cont, cont, cont, title, _a, _c, p, l;
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                entryNameDecoded = decodeURI_1.tryDecodeURI(entryName);
                if (!entryNameDecoded) {
                    return [2];
                }
                return [4, zipHasEntry_1.zipHasEntry(zip, entryNameDecoded, entryName)];
            case 1:
                has = _d.sent();
                if (!!has) return [3, 3];
                console.log("NOT IN ZIP: " + entryName + " --- " + entryNameDecoded);
                return [4, zip.getEntries()];
            case 2:
                zipEntries = _d.sent();
                for (_i = 0, zipEntries_1 = zipEntries; _i < zipEntries_1.length; _i++) {
                    zipEntry = zipEntries_1[_i];
                    console.log(zipEntry);
                }
                return [2];
            case 3:
                _d.trys.push([3, 5, , 6]);
                return [4, zip.entryStreamPromise(entryNameDecoded)];
            case 4:
                comicZipStream_ = _d.sent();
                return [3, 6];
            case 5:
                err_4 = _d.sent();
                console.log(err_4);
                return [2];
            case 6:
                comicZipStream = comicZipStream_.stream;
                _d.label = 7;
            case 7:
                _d.trys.push([7, 9, , 10]);
                return [4, BufferUtils_1.streamToBufferPromise(comicZipStream)];
            case 8:
                comicZipData = _d.sent();
                return [3, 10];
            case 9:
                err_5 = _d.sent();
                console.log(err_5);
                return [2];
            case 10:
                comicXmlStr = comicZipData.toString("utf8");
                comicXmlDoc = new xmldom.DOMParser().parseFromString(comicXmlStr);
                comicMeta = xml_js_mapper_1.XML.deserialize(comicXmlDoc, comicrack_1.ComicInfo);
                comicMeta.ZipPath = entryNameDecoded;
                if (!publication.Metadata) {
                    publication.Metadata = new metadata_1.Metadata();
                }
                if (comicMeta.Writer) {
                    cont = new metadata_contributor_1.Contributor();
                    cont.Name = comicMeta.Writer;
                    if (!publication.Metadata.Author) {
                        publication.Metadata.Author = [];
                    }
                    publication.Metadata.Author.push(cont);
                }
                if (comicMeta.Penciller) {
                    cont = new metadata_contributor_1.Contributor();
                    cont.Name = comicMeta.Writer;
                    if (!publication.Metadata.Penciler) {
                        publication.Metadata.Penciler = [];
                    }
                    publication.Metadata.Penciler.push(cont);
                }
                if (comicMeta.Colorist) {
                    cont = new metadata_contributor_1.Contributor();
                    cont.Name = comicMeta.Writer;
                    if (!publication.Metadata.Colorist) {
                        publication.Metadata.Colorist = [];
                    }
                    publication.Metadata.Colorist.push(cont);
                }
                if (comicMeta.Inker) {
                    cont = new metadata_contributor_1.Contributor();
                    cont.Name = comicMeta.Writer;
                    if (!publication.Metadata.Inker) {
                        publication.Metadata.Inker = [];
                    }
                    publication.Metadata.Inker.push(cont);
                }
                if (comicMeta.Title) {
                    publication.Metadata.Title = comicMeta.Title;
                }
                if (!publication.Metadata.Title) {
                    if (comicMeta.Series) {
                        title = comicMeta.Series;
                        if (comicMeta.Number) {
                            title = title + " - " + comicMeta.Number;
                        }
                        publication.Metadata.Title = title;
                    }
                }
                if (!comicMeta.Pages) return [3, 15];
                _a = 0, _c = comicMeta.Pages;
                _d.label = 11;
            case 11:
                if (!(_a < _c.length)) return [3, 15];
                p = _c[_a];
                l = new publication_link_1.Link();
                if (!(p.Type === "FrontCover")) return [3, 13];
                l.AddRel("cover");
                return [4, epub_1.addCoverDimensions(publication, l)];
            case 12:
                _d.sent();
                _d.label = 13;
            case 13:
                if (publication.Spine) {
                    l.setHrefDecoded(publication.Spine[p.Image].Href);
                }
                if (p.ImageHeight) {
                    l.Height = p.ImageHeight;
                }
                if (p.ImageWidth) {
                    l.Width = p.ImageWidth;
                }
                if (p.Bookmark) {
                    l.Title = p.Bookmark;
                }
                if (!publication.TOC) {
                    publication.TOC = [];
                }
                publication.TOC.push(l);
                _d.label = 14;
            case 14:
                _a++;
                return [3, 11];
            case 15: return [2];
        }
    });
}); };
//# sourceMappingURL=cbz.js.map