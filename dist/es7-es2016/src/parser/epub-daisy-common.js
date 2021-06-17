"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDurations = exports.lazyLoadMediaOverlays = exports.addMediaOverlaySMIL = exports.fillTOC = exports.loadFileBufferFromZipPath = exports.loadFileStrFromZipPath = exports.addOtherMetadata = exports.getOpf = exports.getNcx = exports.setPublicationDirection = exports.addTitle = exports.addIdentifier = exports.addLanguage = exports.fillSpineAndResource = exports.findInManifestByID = exports.findInSpineByHref = exports.findAllMetaByRefineAndProperty = exports.findMetaByRefineAndProperty = exports.addContributor = exports.findContributorInMeta = exports.fillSubject = exports.fillPublicationDate = exports.isEpub3OrMore = exports.parseSpaceSeparatedString = exports.BCP47_UNKNOWN_LANG = exports.mediaOverlayURLParam = exports.mediaOverlayURLPath = void 0;
const tslib_1 = require("tslib");
const debug_ = require("debug");
const mime = require("mime-types");
const moment = require("moment");
const path = require("path");
const xmldom = require("xmldom");
const media_overlay_1 = require("../models/media-overlay");
const metadata_1 = require("../models/metadata");
const metadata_contributor_1 = require("../models/metadata-contributor");
const metadata_media_overlay_1 = require("../models/metadata-media-overlay");
const metadata_properties_1 = require("../models/metadata-properties");
const metadata_subject_1 = require("../models/metadata-subject");
const publication_link_1 = require("../models/publication-link");
const ta_json_string_tokens_converter_1 = require("../models/ta-json-string-tokens-converter");
const UrlUtils_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/http/UrlUtils");
const BufferUtils_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/stream/BufferUtils");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/xml-js-mapper");
const transformer_1 = require("../transform/transformer");
const zipHasEntry_1 = require("../_utils/zipHasEntry");
const ncx_1 = require("./epub/ncx");
const opf_1 = require("./epub/opf");
const opf_author_1 = require("./epub/opf-author");
const smil_1 = require("./epub/smil");
const smil_seq_1 = require("./epub/smil-seq");
const debug = debug_("r2:shared#parser/epub-daisy-common");
const epub3 = "3.0";
const epub301 = "3.0.1";
const epub31 = "3.1";
exports.mediaOverlayURLPath = "media-overlay.json";
exports.mediaOverlayURLParam = "resource";
exports.BCP47_UNKNOWN_LANG = "und";
const parseSpaceSeparatedString = (str) => {
    return str ? str.trim().split(" ").map((role) => {
        return role.trim();
    }).filter((role) => {
        return role.length > 0;
    }) : [];
};
exports.parseSpaceSeparatedString = parseSpaceSeparatedString;
const getEpubVersion = (rootfile, opf) => {
    if (rootfile.Version) {
        return rootfile.Version;
    }
    else if (opf.Version) {
        return opf.Version;
    }
    return undefined;
};
const isEpub3OrMore = (rootfile, opf) => {
    const version = getEpubVersion(rootfile, opf);
    return (version === epub3 || version === epub301 || version === epub31);
};
exports.isEpub3OrMore = isEpub3OrMore;
const fillPublicationDate = (publication, rootfile, opf) => {
    var _a, _b, _c, _d, _e;
    const opfMetadataDate = ((_c = (_b = (_a = opf.Metadata) === null || _a === void 0 ? void 0 : _a.DCMetadata) === null || _b === void 0 ? void 0 : _b.Date) === null || _c === void 0 ? void 0 : _c.length) ?
        opf.Metadata.DCMetadata.Date :
        (((_e = (_d = opf.Metadata) === null || _d === void 0 ? void 0 : _d.Date) === null || _e === void 0 ? void 0 : _e.length) ?
            opf.Metadata.Date :
            undefined);
    if (opfMetadataDate) {
        if ((!rootfile || exports.isEpub3OrMore(rootfile, opf)) &&
            opfMetadataDate[0] && opfMetadataDate[0].Data) {
            const token = opfMetadataDate[0].Data;
            try {
                const mom = moment(token);
                if (mom.isValid()) {
                    publication.Metadata.PublicationDate = mom.toDate();
                }
            }
            catch (err) {
                debug("INVALID DATE/TIME? " + token);
            }
            return;
        }
        opfMetadataDate.forEach((date) => {
            if (date.Data && date.Event && date.Event.indexOf("publication") >= 0) {
                const token = date.Data;
                try {
                    const mom = moment(token);
                    if (mom.isValid()) {
                        publication.Metadata.PublicationDate = mom.toDate();
                    }
                }
                catch (err) {
                    debug("INVALID DATE/TIME? " + token);
                }
            }
        });
    }
};
exports.fillPublicationDate = fillPublicationDate;
const fillSubject = (publication, opf) => {
    var _a, _b, _c, _d, _e;
    const opfMetadataSubject = ((_c = (_b = (_a = opf.Metadata) === null || _a === void 0 ? void 0 : _a.DCMetadata) === null || _b === void 0 ? void 0 : _b.Subject) === null || _c === void 0 ? void 0 : _c.length) ?
        opf.Metadata.DCMetadata.Subject :
        (((_e = (_d = opf.Metadata) === null || _d === void 0 ? void 0 : _d.Subject) === null || _e === void 0 ? void 0 : _e.length) ?
            opf.Metadata.Subject :
            undefined);
    if (opfMetadataSubject) {
        opfMetadataSubject.forEach((s) => {
            const sub = new metadata_subject_1.Subject();
            if (s.Lang) {
                sub.Name = {};
                sub.Name[s.Lang] = s.Data;
            }
            else {
                sub.Name = s.Data;
            }
            sub.Code = s.Term;
            sub.Scheme = s.Authority;
            if (!publication.Metadata.Subject) {
                publication.Metadata.Subject = [];
            }
            publication.Metadata.Subject.push(sub);
        });
    }
};
exports.fillSubject = fillSubject;
const findContributorInMeta = (publication, rootfile, opf) => {
    var _a, _b, _c, _d, _e;
    if (!rootfile || exports.isEpub3OrMore(rootfile, opf)) {
        const func = (meta) => {
            if (meta.Property === "dcterms:creator" || meta.Property === "dcterms:contributor") {
                const cont = new opf_author_1.Author();
                cont.Data = meta.Data;
                cont.ID = meta.ID;
                exports.addContributor(publication, rootfile, opf, cont, undefined);
            }
        };
        if ((_c = (_b = (_a = opf.Metadata) === null || _a === void 0 ? void 0 : _a.XMetadata) === null || _b === void 0 ? void 0 : _b.Meta) === null || _c === void 0 ? void 0 : _c.length) {
            opf.Metadata.XMetadata.Meta.forEach(func);
        }
        if ((_e = (_d = opf.Metadata) === null || _d === void 0 ? void 0 : _d.Meta) === null || _e === void 0 ? void 0 : _e.length) {
            opf.Metadata.Meta.forEach(func);
        }
    }
};
exports.findContributorInMeta = findContributorInMeta;
const addContributor = (publication, rootfile, opf, cont, forcedRole) => {
    const contributor = new metadata_contributor_1.Contributor();
    let role;
    if (rootfile && exports.isEpub3OrMore(rootfile, opf)) {
        if (cont.FileAs) {
            contributor.SortAs = cont.FileAs;
        }
        else {
            const metaFileAs = exports.findMetaByRefineAndProperty(opf, cont.ID, "file-as");
            if (metaFileAs && metaFileAs.Property === "file-as") {
                contributor.SortAs = metaFileAs.Data;
            }
        }
        const metaRole = exports.findMetaByRefineAndProperty(opf, cont.ID, "role");
        if (metaRole && metaRole.Property === "role") {
            role = metaRole.Data;
        }
        if (!role && forcedRole) {
            role = forcedRole;
        }
        const metaAlt = exports.findAllMetaByRefineAndProperty(opf, cont.ID, "alternate-script");
        if (metaAlt && metaAlt.length) {
            contributor.Name = {};
            metaAlt.forEach((m) => {
                if (m.Lang) {
                    contributor.Name[m.Lang] = m.Data;
                }
            });
            const xmlLang = cont.Lang || opf.Lang;
            if (xmlLang) {
                contributor.Name[xmlLang.toLowerCase()] = cont.Data;
            }
            else if (publication.Metadata &&
                publication.Metadata.Language &&
                publication.Metadata.Language.length &&
                !contributor.Name[publication.Metadata.Language[0].toLowerCase()]) {
                contributor.Name[publication.Metadata.Language[0].toLowerCase()] = cont.Data;
            }
            else {
                contributor.Name[exports.BCP47_UNKNOWN_LANG] = cont.Data;
            }
        }
        else {
            contributor.Name = cont.Data;
        }
    }
    else {
        contributor.Name = cont.Data;
        role = cont.Role;
        if (!role && forcedRole) {
            role = forcedRole;
        }
    }
    if (role) {
        switch (role) {
            case "aut": {
                if (!publication.Metadata.Author) {
                    publication.Metadata.Author = [];
                }
                publication.Metadata.Author.push(contributor);
                break;
            }
            case "trl": {
                if (!publication.Metadata.Translator) {
                    publication.Metadata.Translator = [];
                }
                publication.Metadata.Translator.push(contributor);
                break;
            }
            case "art": {
                if (!publication.Metadata.Artist) {
                    publication.Metadata.Artist = [];
                }
                publication.Metadata.Artist.push(contributor);
                break;
            }
            case "edt": {
                if (!publication.Metadata.Editor) {
                    publication.Metadata.Editor = [];
                }
                publication.Metadata.Editor.push(contributor);
                break;
            }
            case "ill": {
                if (!publication.Metadata.Illustrator) {
                    publication.Metadata.Illustrator = [];
                }
                publication.Metadata.Illustrator.push(contributor);
                break;
            }
            case "ltr": {
                if (!publication.Metadata.Letterer) {
                    publication.Metadata.Letterer = [];
                }
                publication.Metadata.Letterer.push(contributor);
                break;
            }
            case "pen": {
                if (!publication.Metadata.Penciler) {
                    publication.Metadata.Penciler = [];
                }
                publication.Metadata.Penciler.push(contributor);
                break;
            }
            case "clr": {
                if (!publication.Metadata.Colorist) {
                    publication.Metadata.Colorist = [];
                }
                publication.Metadata.Colorist.push(contributor);
                break;
            }
            case "ink": {
                if (!publication.Metadata.Inker) {
                    publication.Metadata.Inker = [];
                }
                publication.Metadata.Inker.push(contributor);
                break;
            }
            case "nrt": {
                if (!publication.Metadata.Narrator) {
                    publication.Metadata.Narrator = [];
                }
                publication.Metadata.Narrator.push(contributor);
                break;
            }
            case "pbl": {
                if (!publication.Metadata.Publisher) {
                    publication.Metadata.Publisher = [];
                }
                publication.Metadata.Publisher.push(contributor);
                break;
            }
            default: {
                contributor.Role = [role];
                if (!publication.Metadata.Contributor) {
                    publication.Metadata.Contributor = [];
                }
                publication.Metadata.Contributor.push(contributor);
            }
        }
    }
};
exports.addContributor = addContributor;
const findMetaByRefineAndProperty = (opf, ID, property) => {
    const ret = exports.findAllMetaByRefineAndProperty(opf, ID, property);
    if (ret.length) {
        return ret[0];
    }
    return undefined;
};
exports.findMetaByRefineAndProperty = findMetaByRefineAndProperty;
const findAllMetaByRefineAndProperty = (opf, ID, property) => {
    var _a, _b, _c, _d, _e;
    const metas = [];
    const refineID = "#" + ID;
    const func = (metaTag) => {
        if (metaTag.Refine === refineID && metaTag.Property === property) {
            metas.push(metaTag);
        }
    };
    if ((_c = (_b = (_a = opf.Metadata) === null || _a === void 0 ? void 0 : _a.XMetadata) === null || _b === void 0 ? void 0 : _b.Meta) === null || _c === void 0 ? void 0 : _c.length) {
        opf.Metadata.XMetadata.Meta.forEach(func);
    }
    if ((_e = (_d = opf.Metadata) === null || _d === void 0 ? void 0 : _d.Meta) === null || _e === void 0 ? void 0 : _e.length) {
        opf.Metadata.Meta.forEach(func);
    }
    return metas;
};
exports.findAllMetaByRefineAndProperty = findAllMetaByRefineAndProperty;
const findInSpineByHref = (publication, href) => {
    if (publication.Spine && publication.Spine.length) {
        const ll = publication.Spine.find((l) => {
            if (l.HrefDecoded === href) {
                return true;
            }
            return false;
        });
        if (ll) {
            return ll;
        }
    }
    return undefined;
};
exports.findInSpineByHref = findInSpineByHref;
const findInManifestByID = (publication, rootfile, opf, ID, zip, addLinkData) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (opf.Manifest && opf.Manifest.length) {
        const item = opf.Manifest.find((manItem) => {
            if (manItem.ID === ID) {
                return true;
            }
            return false;
        });
        if (item && opf.ZipPath) {
            const linkItem = new publication_link_1.Link();
            linkItem.TypeLink = item.MediaType;
            const itemHrefDecoded = item.HrefDecoded;
            if (!itemHrefDecoded) {
                return Promise.reject("item.Href?!");
            }
            linkItem.setHrefDecoded(path.join(path.dirname(opf.ZipPath), itemHrefDecoded)
                .replace(/\\/g, "/"));
            yield addLinkData(publication, rootfile, opf, zip, linkItem, item);
            return linkItem;
        }
    }
    return Promise.reject(`ID ${ID} not found`);
});
exports.findInManifestByID = findInManifestByID;
const fillSpineAndResource = (publication, rootfile, opf, zip, addLinkData) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!opf.ZipPath) {
        return;
    }
    if (opf.Spine && opf.Spine.Items && opf.Spine.Items.length) {
        for (const item of opf.Spine.Items) {
            if (!item.Linear || item.Linear === "yes") {
                let linkItem;
                try {
                    linkItem = yield exports.findInManifestByID(publication, rootfile, opf, item.IDref, zip, addLinkData);
                }
                catch (err) {
                    debug(err);
                    continue;
                }
                if (linkItem && linkItem.Href) {
                    if (!publication.Spine) {
                        publication.Spine = [];
                    }
                    publication.Spine.push(linkItem);
                }
            }
        }
    }
    if (opf.Manifest && opf.Manifest.length) {
        for (const item of opf.Manifest) {
            const itemHrefDecoded = item.HrefDecoded;
            if (!itemHrefDecoded) {
                debug("!? item.Href");
                continue;
            }
            const zipPath = path.join(path.dirname(opf.ZipPath), itemHrefDecoded)
                .replace(/\\/g, "/");
            const linkSpine = exports.findInSpineByHref(publication, zipPath);
            if (!linkSpine || !linkSpine.Href) {
                const linkItem = new publication_link_1.Link();
                linkItem.TypeLink = item.MediaType;
                linkItem.setHrefDecoded(zipPath);
                yield addLinkData(publication, rootfile, opf, zip, linkItem, item);
                if (!publication.Resources) {
                    publication.Resources = [];
                }
                publication.Resources.push(linkItem);
            }
        }
    }
});
exports.fillSpineAndResource = fillSpineAndResource;
const addLanguage = (publication, opf) => {
    var _a, _b, _c, _d, _e;
    const opfMetadataLanguage = ((_c = (_b = (_a = opf.Metadata) === null || _a === void 0 ? void 0 : _a.DCMetadata) === null || _b === void 0 ? void 0 : _b.Language) === null || _c === void 0 ? void 0 : _c.length) ?
        opf.Metadata.DCMetadata.Language :
        (((_e = (_d = opf.Metadata) === null || _d === void 0 ? void 0 : _d.Language) === null || _e === void 0 ? void 0 : _e.length) ?
            opf.Metadata.Language :
            undefined);
    if (opfMetadataLanguage) {
        publication.Metadata.Language = opfMetadataLanguage;
    }
};
exports.addLanguage = addLanguage;
const addIdentifier = (publication, opf) => {
    var _a, _b, _c, _d, _e;
    const opfMetadataIdentifier = ((_c = (_b = (_a = opf.Metadata) === null || _a === void 0 ? void 0 : _a.DCMetadata) === null || _b === void 0 ? void 0 : _b.Identifier) === null || _c === void 0 ? void 0 : _c.length) ?
        opf.Metadata.DCMetadata.Identifier :
        (((_e = (_d = opf.Metadata) === null || _d === void 0 ? void 0 : _d.Identifier) === null || _e === void 0 ? void 0 : _e.length) ?
            opf.Metadata.Identifier :
            undefined);
    if (opfMetadataIdentifier) {
        if (opf.UniqueIdentifier && opfMetadataIdentifier.length > 1) {
            opfMetadataIdentifier.forEach((iden) => {
                if (iden.ID === opf.UniqueIdentifier) {
                    publication.Metadata.Identifier = iden.Data;
                }
            });
        }
        else if (opfMetadataIdentifier.length > 0) {
            publication.Metadata.Identifier = opfMetadataIdentifier[0].Data;
        }
    }
};
exports.addIdentifier = addIdentifier;
const addTitle = (publication, rootfile, opf) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const opfMetadataTitle = ((_c = (_b = (_a = opf.Metadata) === null || _a === void 0 ? void 0 : _a.DCMetadata) === null || _b === void 0 ? void 0 : _b.Title) === null || _c === void 0 ? void 0 : _c.length) ?
        opf.Metadata.DCMetadata.Title :
        (((_e = (_d = opf.Metadata) === null || _d === void 0 ? void 0 : _d.Title) === null || _e === void 0 ? void 0 : _e.length) ?
            opf.Metadata.Title :
            undefined);
    if (rootfile && exports.isEpub3OrMore(rootfile, opf)) {
        let mainTitle;
        let subTitle;
        let subTitleDisplaySeq = 0;
        if (opfMetadataTitle) {
            if (((_f = opf.Metadata) === null || _f === void 0 ? void 0 : _f.Meta) || ((_h = (_g = opf.Metadata) === null || _g === void 0 ? void 0 : _g.XMetadata) === null || _h === void 0 ? void 0 : _h.Meta)) {
                const tt = opfMetadataTitle.find((title) => {
                    var _a, _b, _c;
                    const refineID = "#" + title.ID;
                    const func0 = (meta) => {
                        if (meta.Data === "main" && meta.Refine === refineID) {
                            return true;
                        }
                        return false;
                    };
                    let m = ((_a = opf.Metadata) === null || _a === void 0 ? void 0 : _a.Meta) ? opf.Metadata.Meta.find(func0) : undefined;
                    if (!m && ((_c = (_b = opf.Metadata) === null || _b === void 0 ? void 0 : _b.XMetadata) === null || _c === void 0 ? void 0 : _c.Meta)) {
                        m = opf.Metadata.XMetadata.Meta.find(func0);
                    }
                    if (m) {
                        return true;
                    }
                    return false;
                });
                if (tt) {
                    mainTitle = tt;
                }
                opfMetadataTitle.forEach((title) => {
                    var _a, _b, _c, _d, _e, _f;
                    const refineID = "#" + title.ID;
                    const func1 = (meta) => {
                        if (meta.Data === "subtitle" && meta.Refine === refineID) {
                            return true;
                        }
                        return false;
                    };
                    let m = ((_a = opf.Metadata) === null || _a === void 0 ? void 0 : _a.Meta) ? opf.Metadata.Meta.find(func1) : undefined;
                    if (!m && ((_c = (_b = opf.Metadata) === null || _b === void 0 ? void 0 : _b.XMetadata) === null || _c === void 0 ? void 0 : _c.Meta)) {
                        m = opf.Metadata.XMetadata.Meta.find(func1);
                    }
                    if (m) {
                        let titleDisplaySeq = 0;
                        const func2 = (meta) => {
                            if (meta.Property === "display-seq" && meta.Refine === refineID) {
                                return true;
                            }
                            return false;
                        };
                        let mds = ((_d = opf.Metadata) === null || _d === void 0 ? void 0 : _d.Meta) ? opf.Metadata.Meta.find(func2) : undefined;
                        if (!mds && ((_f = (_e = opf.Metadata) === null || _e === void 0 ? void 0 : _e.XMetadata) === null || _f === void 0 ? void 0 : _f.Meta)) {
                            mds = opf.Metadata.XMetadata.Meta.find(func2);
                        }
                        if (mds) {
                            try {
                                titleDisplaySeq = parseInt(mds.Data, 10);
                            }
                            catch (err) {
                                debug(err);
                                debug(mds.Data);
                                titleDisplaySeq = 0;
                            }
                            if (isNaN(titleDisplaySeq)) {
                                debug("NaN");
                                debug(mds.Data);
                                titleDisplaySeq = 0;
                            }
                        }
                        else {
                            titleDisplaySeq = 0;
                        }
                        if (!subTitle || titleDisplaySeq < subTitleDisplaySeq) {
                            subTitle = title;
                            subTitleDisplaySeq = titleDisplaySeq;
                        }
                    }
                });
            }
            if (!mainTitle) {
                mainTitle = opfMetadataTitle[0];
            }
        }
        if (mainTitle) {
            const metaAlt = exports.findAllMetaByRefineAndProperty(opf, mainTitle.ID, "alternate-script");
            if (metaAlt && metaAlt.length) {
                publication.Metadata.Title = {};
                metaAlt.forEach((m) => {
                    if (m.Lang) {
                        publication.Metadata.Title[m.Lang.toLowerCase()] = m.Data;
                    }
                });
                const xmlLang = mainTitle.Lang || opf.Lang;
                if (xmlLang) {
                    publication.Metadata.Title[xmlLang.toLowerCase()] = mainTitle.Data;
                }
                else if (publication.Metadata.Language &&
                    publication.Metadata.Language.length &&
                    !publication.Metadata.Title[publication.Metadata.Language[0].toLowerCase()]) {
                    publication.Metadata.Title[publication.Metadata.Language[0].toLowerCase()] = mainTitle.Data;
                }
                else {
                    publication.Metadata.Title[exports.BCP47_UNKNOWN_LANG] = mainTitle.Data;
                }
            }
            else {
                publication.Metadata.Title = mainTitle.Data;
            }
        }
        if (subTitle) {
            const metaAlt = exports.findAllMetaByRefineAndProperty(opf, subTitle.ID, "alternate-script");
            if (metaAlt && metaAlt.length) {
                publication.Metadata.SubTitle = {};
                metaAlt.forEach((m) => {
                    if (m.Lang) {
                        publication.Metadata.SubTitle[m.Lang.toLowerCase()] = m.Data;
                    }
                });
                const xmlLang = subTitle.Lang || opf.Lang;
                if (xmlLang) {
                    publication.Metadata.SubTitle[xmlLang.toLowerCase()] = subTitle.Data;
                }
                else if (publication.Metadata.Language &&
                    publication.Metadata.Language.length &&
                    !publication.Metadata.SubTitle[publication.Metadata.Language[0].toLowerCase()]) {
                    publication.Metadata.SubTitle[publication.Metadata.Language[0].toLowerCase()] = subTitle.Data;
                }
                else {
                    publication.Metadata.SubTitle[exports.BCP47_UNKNOWN_LANG] = subTitle.Data;
                }
            }
            else {
                publication.Metadata.SubTitle = subTitle.Data;
            }
        }
    }
    else {
        if (opfMetadataTitle) {
            publication.Metadata.Title = opfMetadataTitle[0].Data;
        }
    }
};
exports.addTitle = addTitle;
const setPublicationDirection = (publication, opf) => {
    if (opf.Spine && opf.Spine.PageProgression) {
        switch (opf.Spine.PageProgression) {
            case "auto": {
                publication.Metadata.Direction = metadata_1.DirectionEnum.Auto;
                break;
            }
            case "ltr": {
                publication.Metadata.Direction = metadata_1.DirectionEnum.LTR;
                break;
            }
            case "rtl": {
                publication.Metadata.Direction = metadata_1.DirectionEnum.RTL;
                break;
            }
        }
    }
    if (publication.Metadata.Language && publication.Metadata.Language.length &&
        (!publication.Metadata.Direction || publication.Metadata.Direction === metadata_1.DirectionEnum.Auto)) {
        const lang = publication.Metadata.Language[0].toLowerCase();
        if ((lang === "ar" || lang.startsWith("ar-") ||
            lang === "he" || lang.startsWith("he-") ||
            lang === "fa" || lang.startsWith("fa-")) ||
            lang === "zh-Hant" ||
            lang === "zh-TW") {
            publication.Metadata.Direction = metadata_1.DirectionEnum.RTL;
        }
    }
};
exports.setPublicationDirection = setPublicationDirection;
const getNcx = (ncxManItem, opf, zip) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!opf.ZipPath) {
        return Promise.reject("?!!opf.ZipPath");
    }
    const dname = path.dirname(opf.ZipPath);
    const ncxManItemHrefDecoded = ncxManItem.HrefDecoded;
    if (!ncxManItemHrefDecoded) {
        return Promise.reject("?!ncxManItem.Href");
    }
    const ncxFilePath = path.join(dname, ncxManItemHrefDecoded).replace(/\\/g, "/");
    const has = yield zipHasEntry_1.zipHasEntry(zip, ncxFilePath, undefined);
    if (!has) {
        const err = `NOT IN ZIP (NCX): ${ncxManItem.Href} --- ${ncxFilePath}`;
        debug(err);
        const zipEntries = yield zip.getEntries();
        for (const zipEntry of zipEntries) {
            debug(zipEntry);
        }
        return Promise.reject(err);
    }
    let ncxZipStream_;
    try {
        ncxZipStream_ = yield zip.entryStreamPromise(ncxFilePath);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    const ncxZipStream = ncxZipStream_.stream;
    let ncxZipData;
    try {
        ncxZipData = yield BufferUtils_1.streamToBufferPromise(ncxZipStream);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    let ncxStr = ncxZipData.toString("utf8");
    const iStart = ncxStr.indexOf("<ncx");
    if (iStart >= 0) {
        const iEnd = ncxStr.indexOf(">", iStart);
        if (iEnd > iStart) {
            const clip = ncxStr.substr(iStart, iEnd - iStart);
            if (clip.indexOf("xmlns") < 0) {
                ncxStr = ncxStr.replace(/<ncx/, "<ncx xmlns=\"http://www.daisy.org/z3986/2005/ncx/\" ");
            }
        }
    }
    const ncxDoc = new xmldom.DOMParser().parseFromString(ncxStr);
    const ncx = xml_js_mapper_1.XML.deserialize(ncxDoc, ncx_1.NCX);
    ncx.ZipPath = ncxFilePath;
    return ncx;
});
exports.getNcx = getNcx;
const getOpf = (zip, rootfilePathDecoded, rootfilePath) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const has = yield zipHasEntry_1.zipHasEntry(zip, rootfilePathDecoded, rootfilePath);
    if (!has) {
        const err = `NOT IN ZIP (container OPF rootfile): ${rootfilePath} --- ${rootfilePathDecoded}`;
        debug(err);
        const zipEntries = yield zip.getEntries();
        for (const zipEntry of zipEntries) {
            debug(zipEntry);
        }
        return Promise.reject(err);
    }
    let opfZipStream_;
    try {
        opfZipStream_ = yield zip.entryStreamPromise(rootfilePathDecoded);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    const opfZipStream = opfZipStream_.stream;
    let opfZipData;
    try {
        opfZipData = yield BufferUtils_1.streamToBufferPromise(opfZipStream);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    let opfStr = opfZipData.toString("utf8");
    const iStart = opfStr.indexOf("<package");
    if (iStart >= 0) {
        const iEnd = opfStr.indexOf(">", iStart);
        if (iEnd > iStart) {
            const clip = opfStr.substr(iStart, iEnd - iStart);
            if (clip.indexOf("xmlns") < 0) {
                opfStr = opfStr.replace(/<package/, "<package xmlns=\"http://openebook.org/namespaces/oeb-package/1.0/\" ");
            }
        }
    }
    const opfDoc = new xmldom.DOMParser().parseFromString(opfStr);
    const opf = xml_js_mapper_1.XML.deserialize(opfDoc, opf_1.OPF);
    opf.ZipPath = rootfilePathDecoded;
    return opf;
});
exports.getOpf = getOpf;
const addOtherMetadata = (publication, rootfile, opf) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
    if (!opf.Metadata) {
        return;
    }
    const opfMetadataRights = ((_c = (_b = (_a = opf.Metadata) === null || _a === void 0 ? void 0 : _a.DCMetadata) === null || _b === void 0 ? void 0 : _b.Rights) === null || _c === void 0 ? void 0 : _c.length) ?
        opf.Metadata.DCMetadata.Rights :
        (((_e = (_d = opf.Metadata) === null || _d === void 0 ? void 0 : _d.Rights) === null || _e === void 0 ? void 0 : _e.length) ?
            opf.Metadata.Rights :
            undefined);
    if (opfMetadataRights) {
        publication.Metadata.Rights = opfMetadataRights.join(" ");
    }
    const opfMetadataDescription = ((_h = (_g = (_f = opf.Metadata) === null || _f === void 0 ? void 0 : _f.DCMetadata) === null || _g === void 0 ? void 0 : _g.Description) === null || _h === void 0 ? void 0 : _h.length) ?
        opf.Metadata.DCMetadata.Description :
        (((_k = (_j = opf.Metadata) === null || _j === void 0 ? void 0 : _j.Description) === null || _k === void 0 ? void 0 : _k.length) ?
            opf.Metadata.Description :
            undefined);
    if (opfMetadataDescription) {
        publication.Metadata.Description = opfMetadataDescription[0];
    }
    const opfMetadataPublisher = ((_o = (_m = (_l = opf.Metadata) === null || _l === void 0 ? void 0 : _l.DCMetadata) === null || _m === void 0 ? void 0 : _m.Publisher) === null || _o === void 0 ? void 0 : _o.length) ?
        opf.Metadata.DCMetadata.Publisher :
        (((_q = (_p = opf.Metadata) === null || _p === void 0 ? void 0 : _p.Publisher) === null || _q === void 0 ? void 0 : _q.length) ?
            opf.Metadata.Publisher :
            undefined);
    if (opfMetadataPublisher) {
        publication.Metadata.Publisher = [];
        opfMetadataPublisher.forEach((pub) => {
            const contrib = new metadata_contributor_1.Contributor();
            contrib.Name = pub;
            publication.Metadata.Publisher.push(contrib);
        });
    }
    const opfMetadataSource = ((_t = (_s = (_r = opf.Metadata) === null || _r === void 0 ? void 0 : _r.DCMetadata) === null || _s === void 0 ? void 0 : _s.Source) === null || _t === void 0 ? void 0 : _t.length) ?
        opf.Metadata.DCMetadata.Source :
        (((_v = (_u = opf.Metadata) === null || _u === void 0 ? void 0 : _u.Source) === null || _v === void 0 ? void 0 : _v.length) ?
            opf.Metadata.Source :
            undefined);
    if (opfMetadataSource) {
        publication.Metadata.Source = opfMetadataSource[0];
    }
    const opfMetadataContributor = ((_y = (_x = (_w = opf.Metadata) === null || _w === void 0 ? void 0 : _w.DCMetadata) === null || _x === void 0 ? void 0 : _x.Contributor) === null || _y === void 0 ? void 0 : _y.length) ?
        opf.Metadata.DCMetadata.Contributor :
        (((_0 = (_z = opf.Metadata) === null || _z === void 0 ? void 0 : _z.Contributor) === null || _0 === void 0 ? void 0 : _0.length) ?
            opf.Metadata.Contributor :
            undefined);
    if (opfMetadataContributor) {
        opfMetadataContributor.forEach((cont) => {
            exports.addContributor(publication, rootfile, opf, cont, undefined);
        });
    }
    const opfMetadataCreator = ((_3 = (_2 = (_1 = opf.Metadata) === null || _1 === void 0 ? void 0 : _1.DCMetadata) === null || _2 === void 0 ? void 0 : _2.Creator) === null || _3 === void 0 ? void 0 : _3.length) ?
        opf.Metadata.DCMetadata.Creator :
        (((_5 = (_4 = opf.Metadata) === null || _4 === void 0 ? void 0 : _4.Creator) === null || _5 === void 0 ? void 0 : _5.length) ?
            opf.Metadata.Creator :
            undefined);
    if (opfMetadataCreator) {
        opfMetadataCreator.forEach((cont) => {
            exports.addContributor(publication, rootfile, opf, cont, "aut");
        });
    }
    if ((_6 = opf.Metadata) === null || _6 === void 0 ? void 0 : _6.Link) {
        opf.Metadata.Link.forEach((metaLink) => {
            if (metaLink.Property === "a11y:certifierCredential") {
                let val = metaLink.Href;
                if (!val) {
                    return;
                }
                val = val.trim();
                if (!val) {
                    return;
                }
                if (!publication.Metadata.CertifierCredential) {
                    publication.Metadata.CertifierCredential = [];
                }
                publication.Metadata.CertifierCredential.push(val);
            }
            else if (metaLink.Property === "a11y:certifierReport") {
                let val = metaLink.Href;
                if (!val) {
                    return;
                }
                val = val.trim();
                if (!val) {
                    return;
                }
                if (!publication.Metadata.CertifierReport) {
                    publication.Metadata.CertifierReport = [];
                }
                publication.Metadata.CertifierReport.push(val);
            }
            else if (metaLink.Property === "dcterms:conformsTo") {
                let val = metaLink.Href;
                if (!val) {
                    return;
                }
                val = val.trim();
                if (!val) {
                    return;
                }
                if (!publication.Metadata.ConformsTo) {
                    publication.Metadata.ConformsTo = [];
                }
                publication.Metadata.ConformsTo.push(val);
            }
        });
    }
    if (opf.Metadata.Meta || ((_7 = opf.Metadata.XMetadata) === null || _7 === void 0 ? void 0 : _7.Meta)) {
        const AccessibilitySummarys = [];
        const metaFunc = (metaTag) => {
            if (metaTag.Name === "schema:accessMode" ||
                metaTag.Property === "schema:accessMode") {
                let val = metaTag.Property ? metaTag.Data : metaTag.Content;
                if (!val) {
                    return;
                }
                val = val.trim();
                if (!val) {
                    return;
                }
                if (!publication.Metadata.AccessMode) {
                    publication.Metadata.AccessMode = [];
                }
                publication.Metadata.AccessMode.push(val);
            }
            else if (metaTag.Name === "schema:accessibilityFeature" ||
                metaTag.Property === "schema:accessibilityFeature") {
                let val = metaTag.Property ? metaTag.Data : metaTag.Content;
                if (!val) {
                    return;
                }
                val = val.trim();
                if (!val) {
                    return;
                }
                if (!publication.Metadata.AccessibilityFeature) {
                    publication.Metadata.AccessibilityFeature = [];
                }
                publication.Metadata.AccessibilityFeature.push(val);
            }
            else if (metaTag.Name === "schema:accessibilityHazard" ||
                metaTag.Property === "schema:accessibilityHazard") {
                let val = metaTag.Property ? metaTag.Data : metaTag.Content;
                if (!val) {
                    return;
                }
                val = val.trim();
                if (!val) {
                    return;
                }
                if (!publication.Metadata.AccessibilityHazard) {
                    publication.Metadata.AccessibilityHazard = [];
                }
                publication.Metadata.AccessibilityHazard.push(val);
            }
            else if (metaTag.Name === "schema:accessibilitySummary" ||
                metaTag.Property === "schema:accessibilitySummary") {
                let val = metaTag.Property ? metaTag.Data : metaTag.Content;
                if (!val) {
                    return;
                }
                val = val.trim();
                if (!val) {
                    return;
                }
                AccessibilitySummarys.push({
                    metaTag,
                    val,
                });
            }
            else if (metaTag.Name === "schema:accessModeSufficient" ||
                metaTag.Property === "schema:accessModeSufficient") {
                let val = metaTag.Property ? metaTag.Data : metaTag.Content;
                if (!val) {
                    return;
                }
                val = val.trim();
                if (!val) {
                    return;
                }
                if (!publication.Metadata.AccessModeSufficient) {
                    publication.Metadata.AccessModeSufficient = [];
                }
                publication.Metadata.AccessModeSufficient.push(ta_json_string_tokens_converter_1.DelinearizeAccessModeSufficient(val));
            }
            else if (metaTag.Name === "schema:accessibilityAPI" ||
                metaTag.Property === "schema:accessibilityAPI") {
                let val = metaTag.Property ? metaTag.Data : metaTag.Content;
                if (!val) {
                    return;
                }
                val = val.trim();
                if (!val) {
                    return;
                }
                if (!publication.Metadata.AccessibilityAPI) {
                    publication.Metadata.AccessibilityAPI = [];
                }
                publication.Metadata.AccessibilityAPI.push(val);
            }
            else if (metaTag.Name === "schema:accessibilityControl" ||
                metaTag.Property === "schema:accessibilityControl") {
                let val = metaTag.Property ? metaTag.Data : metaTag.Content;
                if (!val) {
                    return;
                }
                val = val.trim();
                if (!val) {
                    return;
                }
                if (!publication.Metadata.AccessibilityControl) {
                    publication.Metadata.AccessibilityControl = [];
                }
                publication.Metadata.AccessibilityControl.push(val);
            }
            else if (metaTag.Name === "a11y:certifiedBy" ||
                metaTag.Property === "a11y:certifiedBy") {
                let val = metaTag.Property ? metaTag.Data : metaTag.Content;
                if (!val) {
                    return;
                }
                val = val.trim();
                if (!val) {
                    return;
                }
                if (!publication.Metadata.CertifiedBy) {
                    publication.Metadata.CertifiedBy = [];
                }
                publication.Metadata.CertifiedBy.push(val);
            }
            else if (metaTag.Name === "a11y:certifierCredential" ||
                metaTag.Property === "a11y:certifierCredential") {
                let val = metaTag.Property ? metaTag.Data : metaTag.Content;
                if (!val) {
                    return;
                }
                val = val.trim();
                if (!val) {
                    return;
                }
                if (!publication.Metadata.CertifierCredential) {
                    publication.Metadata.CertifierCredential = [];
                }
                publication.Metadata.CertifierCredential.push(val);
            }
        };
        if (opf.Metadata.Meta) {
            opf.Metadata.Meta.forEach(metaFunc);
        }
        if ((_8 = opf.Metadata.XMetadata) === null || _8 === void 0 ? void 0 : _8.Meta) {
            opf.Metadata.XMetadata.Meta.forEach(metaFunc);
        }
        if (AccessibilitySummarys.length === 1) {
            const tuple = AccessibilitySummarys[0];
            if (tuple.metaTag.Lang) {
                publication.Metadata.AccessibilitySummary = {};
                publication.Metadata.AccessibilitySummary[tuple.metaTag.Lang.toLowerCase()] = tuple.val;
            }
            else {
                publication.Metadata.AccessibilitySummary = tuple.val;
            }
        }
        else if (AccessibilitySummarys.length) {
            publication.Metadata.AccessibilitySummary = {};
            AccessibilitySummarys.forEach((tuple) => {
                const xmlLang = tuple.metaTag.Lang || opf.Lang;
                if (xmlLang) {
                    publication.Metadata.AccessibilitySummary[xmlLang.toLowerCase()] = tuple.val;
                }
                else if (publication.Metadata.Language &&
                    publication.Metadata.Language.length &&
                    !publication.Metadata.AccessibilitySummary[publication.Metadata.Language[0].toLowerCase()]) {
                    publication.Metadata.AccessibilitySummary[publication.Metadata.Language[0].toLowerCase()] = tuple.val;
                }
                else {
                    publication.Metadata.AccessibilitySummary[exports.BCP47_UNKNOWN_LANG] = tuple.val;
                }
            });
        }
        const metasDuration = [];
        const metasNarrator = [];
        const metasActiveClass = [];
        const metasPlaybackActiveClass = [];
        const mFunc = (metaTag) => {
            if (metaTag.Name === "dtb:totalTime") {
                metasDuration.push(metaTag);
            }
            else if (metaTag.Property === "media:duration" && !metaTag.Refine) {
                metasDuration.push(metaTag);
            }
            else if (metaTag.Property === "media:narrator") {
                metasNarrator.push(metaTag);
            }
            else if (metaTag.Property === "media:active-class") {
                metasActiveClass.push(metaTag);
            }
            else if (metaTag.Property === "media:playback-active-class") {
                metasPlaybackActiveClass.push(metaTag);
            }
            else {
                const key = metaTag.Name ? metaTag.Name : metaTag.Property;
                if (key && !metadata_1.MetadataSupportedKeys.includes(key)) {
                    if (!publication.Metadata.AdditionalJSON) {
                        publication.Metadata.AdditionalJSON = {};
                    }
                    if (metaTag.Name && metaTag.Content) {
                        publication.Metadata.AdditionalJSON[metaTag.Name] = metaTag.Content;
                    }
                    else if (metaTag.Property && metaTag.Data) {
                        publication.Metadata.AdditionalJSON[metaTag.Property] = metaTag.Data;
                    }
                }
            }
        };
        if (opf.Metadata.Meta) {
            opf.Metadata.Meta.forEach(mFunc);
        }
        if ((_9 = opf.Metadata.XMetadata) === null || _9 === void 0 ? void 0 : _9.Meta) {
            opf.Metadata.XMetadata.Meta.forEach(mFunc);
        }
        if (metasDuration.length) {
            publication.Metadata.Duration = media_overlay_1.timeStrToSeconds(metasDuration[0].Property ? metasDuration[0].Data : metasDuration[0].Content);
        }
        if (metasNarrator.length) {
            if (!publication.Metadata.Narrator) {
                publication.Metadata.Narrator = [];
            }
            metasNarrator.forEach((metaNarrator) => {
                const cont = new metadata_contributor_1.Contributor();
                cont.Name = metaNarrator.Data;
                publication.Metadata.Narrator.push(cont);
            });
        }
        if (metasActiveClass.length) {
            if (!publication.Metadata.MediaOverlay) {
                publication.Metadata.MediaOverlay = new metadata_media_overlay_1.MediaOverlay();
            }
            publication.Metadata.MediaOverlay.ActiveClass = metasActiveClass[0].Data;
        }
        if (metasPlaybackActiveClass.length) {
            if (!publication.Metadata.MediaOverlay) {
                publication.Metadata.MediaOverlay = new metadata_media_overlay_1.MediaOverlay();
            }
            publication.Metadata.MediaOverlay.PlaybackActiveClass = metasPlaybackActiveClass[0].Data;
        }
    }
};
exports.addOtherMetadata = addOtherMetadata;
const loadFileStrFromZipPath = (linkHref, linkHrefDecoded, zip) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let zipData;
    try {
        zipData = yield exports.loadFileBufferFromZipPath(linkHref, linkHrefDecoded, zip);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    if (zipData) {
        return zipData.toString("utf8");
    }
    return Promise.reject("?!zipData loadFileStrFromZipPath()");
});
exports.loadFileStrFromZipPath = loadFileStrFromZipPath;
const loadFileBufferFromZipPath = (linkHref, linkHrefDecoded, zip) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!linkHrefDecoded) {
        debug("!?link.HrefDecoded");
        return undefined;
    }
    const has = yield zipHasEntry_1.zipHasEntry(zip, linkHrefDecoded, linkHref);
    if (!has) {
        debug(`NOT IN ZIP (loadFileBufferFromZipPath): ${linkHref} --- ${linkHrefDecoded}`);
        const zipEntries = yield zip.getEntries();
        for (const zipEntry of zipEntries) {
            debug(zipEntry);
        }
        return undefined;
    }
    let zipStream_;
    try {
        zipStream_ = yield zip.entryStreamPromise(linkHrefDecoded);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    const zipStream = zipStream_.stream;
    let zipData;
    try {
        zipData = yield BufferUtils_1.streamToBufferPromise(zipStream);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    return zipData;
});
exports.loadFileBufferFromZipPath = loadFileBufferFromZipPath;
const fillLandmarksFromGuide = (publication, opf) => {
    if (opf.Guide && opf.Guide.length) {
        opf.Guide.forEach((ref) => {
            if (ref.Href && opf.ZipPath) {
                const refHrefDecoded = ref.HrefDecoded;
                if (!refHrefDecoded) {
                    debug("ref.Href?!");
                    return;
                }
                const link = new publication_link_1.Link();
                const zipPath = path.join(path.dirname(opf.ZipPath), refHrefDecoded)
                    .replace(/\\/g, "/");
                link.setHrefDecoded(zipPath);
                link.Title = ref.Title;
                if (!publication.Landmarks) {
                    publication.Landmarks = [];
                }
                publication.Landmarks.push(link);
            }
        });
    }
};
const fillTOCFromNCX = (publication, ncx) => {
    if (ncx.Points && ncx.Points.length) {
        ncx.Points.forEach((point) => {
            if (!publication.TOC) {
                publication.TOC = [];
            }
            fillTOCFromNavPoint(publication, ncx, point, publication.TOC);
        });
    }
};
const addAlternateAudioLinkFromNCX = (ncx, link, navLabel) => {
    if ((navLabel === null || navLabel === void 0 ? void 0 : navLabel.Audio) && navLabel.Audio.Src) {
        const audioSrcDcoded = navLabel.Audio.SrcDecoded;
        if (!audioSrcDcoded) {
            debug("?!audioSrcDcoded");
        }
        else {
            const zipPath = path.join(path.dirname(ncx.ZipPath), audioSrcDcoded)
                .replace(/\\/g, "/");
            let timeHref = zipPath;
            timeHref += "#t=";
            const begin = navLabel.Audio.ClipBegin ? media_overlay_1.timeStrToSeconds(navLabel.Audio.ClipBegin) : 0;
            const end = navLabel.Audio.ClipEnd ? media_overlay_1.timeStrToSeconds(navLabel.Audio.ClipEnd) : 0;
            timeHref += begin.toString();
            if (navLabel.Audio.ClipEnd) {
                timeHref += ",";
                timeHref += end.toString();
            }
            if (!link.Alternate) {
                link.Alternate = [];
            }
            const altLink = new publication_link_1.Link();
            altLink.setHrefDecoded(timeHref);
            const mediaType = mime.lookup(audioSrcDcoded);
            if (mediaType) {
                altLink.TypeLink = mediaType;
            }
            link.Alternate.push(altLink);
        }
    }
};
const fillTOCFromNavPoint = (publication, ncx, point, node) => {
    var _a;
    const srcDecoded = point.Content.SrcDecoded;
    if (!srcDecoded) {
        debug("?!point.Content.Src");
        return;
    }
    const link = new publication_link_1.Link();
    const zipPath = path.join(path.dirname(ncx.ZipPath), srcDecoded)
        .replace(/\\/g, "/");
    link.setHrefDecoded(zipPath);
    link.Title = (_a = point.NavLabel) === null || _a === void 0 ? void 0 : _a.Text;
    addAlternateAudioLinkFromNCX(ncx, link, point.NavLabel);
    if (point.Points && point.Points.length) {
        point.Points.forEach((p) => {
            if (!link.Children) {
                link.Children = [];
            }
            fillTOCFromNavPoint(publication, ncx, p, link.Children);
        });
    }
    node.push(link);
};
const fillPageListFromNCX = (publication, ncx) => {
    if (ncx.PageList && ncx.PageList.PageTarget && ncx.PageList.PageTarget.length) {
        ncx.PageList.PageTarget.forEach((pageTarget) => {
            var _a;
            const link = new publication_link_1.Link();
            const srcDecoded = pageTarget.Content.SrcDecoded;
            if (!srcDecoded) {
                debug("!?srcDecoded");
                return;
            }
            const zipPath = path.join(path.dirname(ncx.ZipPath), srcDecoded)
                .replace(/\\/g, "/");
            link.setHrefDecoded(zipPath);
            link.Title = (_a = pageTarget.NavLabel) === null || _a === void 0 ? void 0 : _a.Text;
            addAlternateAudioLinkFromNCX(ncx, link, pageTarget.NavLabel);
            if (!publication.PageList) {
                publication.PageList = [];
            }
            publication.PageList.push(link);
        });
    }
};
const fillTOC = (publication, opf, ncx) => {
    if (ncx) {
        fillTOCFromNCX(publication, ncx);
        if (!publication.PageList) {
            fillPageListFromNCX(publication, ncx);
        }
    }
    fillLandmarksFromGuide(publication, opf);
};
exports.fillTOC = fillTOC;
const addMediaOverlaySMIL = (link, manItemSmil, opf, zip) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (manItemSmil && manItemSmil.MediaType && manItemSmil.MediaType.startsWith("application/smil")) {
        if (opf.ZipPath) {
            const manItemSmilHrefDecoded = manItemSmil.HrefDecoded;
            if (!manItemSmilHrefDecoded) {
                debug("!?manItemSmil.HrefDecoded");
                return;
            }
            const smilFilePath = path.join(path.dirname(opf.ZipPath), manItemSmilHrefDecoded)
                .replace(/\\/g, "/");
            const has = yield zipHasEntry_1.zipHasEntry(zip, smilFilePath, smilFilePath);
            if (!has) {
                debug(`NOT IN ZIP (addMediaOverlay): ${smilFilePath}`);
                const zipEntries = yield zip.getEntries();
                for (const zipEntry of zipEntries) {
                    debug(zipEntry);
                }
                return;
            }
            const mo = new media_overlay_1.MediaOverlayNode();
            mo.SmilPathInZip = smilFilePath;
            mo.initialized = false;
            link.MediaOverlays = mo;
            const moURL = exports.mediaOverlayURLPath + "?" +
                exports.mediaOverlayURLParam + "=" +
                UrlUtils_1.encodeURIComponent_RFC3986(link.HrefDecoded ? link.HrefDecoded : link.Href);
            if (!link.Properties) {
                link.Properties = new metadata_properties_1.Properties();
            }
            link.Properties.MediaOverlay = moURL;
            if (!link.Alternate) {
                link.Alternate = [];
            }
            const moLink = new publication_link_1.Link();
            moLink.Href = moURL;
            moLink.TypeLink = "application/vnd.syncnarr+json";
            moLink.Duration = link.Duration;
            link.Alternate.push(moLink);
            if (link.Properties && link.Properties.Encrypted) {
                debug("ENCRYPTED SMIL MEDIA OVERLAY: " + (link.HrefDecoded ? link.HrefDecoded : link.Href));
            }
        }
    }
});
exports.addMediaOverlaySMIL = addMediaOverlaySMIL;
const lazyLoadMediaOverlays = (publication, mo) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (mo.initialized || !mo.SmilPathInZip) {
        return;
    }
    let link;
    if (publication.Resources) {
        link = publication.Resources.find((l) => {
            if (l.Href === mo.SmilPathInZip) {
                return true;
            }
            return false;
        });
        if (!link) {
            if (publication.Spine) {
                link = publication.Spine.find((l) => {
                    if (l.Href === mo.SmilPathInZip) {
                        return true;
                    }
                    return false;
                });
            }
        }
        if (!link) {
            const err = "Asset not declared in publication spine/resources! " + mo.SmilPathInZip;
            debug(err);
            return Promise.reject(err);
        }
    }
    const zipInternal = publication.findFromInternal("zip");
    if (!zipInternal) {
        return;
    }
    const zip = zipInternal.Value;
    const has = yield zipHasEntry_1.zipHasEntry(zip, mo.SmilPathInZip, undefined);
    if (!has) {
        const err = `NOT IN ZIP (lazyLoadMediaOverlays): ${mo.SmilPathInZip}`;
        debug(err);
        const zipEntries = yield zip.getEntries();
        for (const zipEntry of zipEntries) {
            debug(zipEntry);
        }
        return Promise.reject(err);
    }
    let smilZipStream_;
    try {
        smilZipStream_ = yield zip.entryStreamPromise(mo.SmilPathInZip);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    if (link && link.Properties && link.Properties.Encrypted) {
        let decryptFail = false;
        let transformedStream;
        try {
            transformedStream = yield transformer_1.Transformers.tryStream(publication, link, undefined, smilZipStream_, false, 0, 0, undefined);
        }
        catch (err) {
            debug(err);
            return Promise.reject(err);
        }
        if (transformedStream) {
            smilZipStream_ = transformedStream;
        }
        else {
            decryptFail = true;
        }
        if (decryptFail) {
            const err = "Encryption scheme not supported.";
            debug(err);
            return Promise.reject(err);
        }
    }
    const smilZipStream = smilZipStream_.stream;
    let smilZipData;
    try {
        smilZipData = yield BufferUtils_1.streamToBufferPromise(smilZipStream);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    let smilStr = smilZipData.toString("utf8");
    const iStart = smilStr.indexOf("<smil");
    if (iStart >= 0) {
        const iEnd = smilStr.indexOf(">", iStart);
        if (iEnd > iStart) {
            const clip = smilStr.substr(iStart, iEnd - iStart);
            if (clip.indexOf("xmlns") < 0) {
                smilStr = smilStr.replace(/<smil/, "<smil xmlns=\"http://www.w3.org/ns/SMIL\" ");
            }
        }
    }
    const smilXmlDoc = new xmldom.DOMParser().parseFromString(smilStr);
    const smil = xml_js_mapper_1.XML.deserialize(smilXmlDoc, smil_1.SMIL);
    smil.ZipPath = mo.SmilPathInZip;
    mo.initialized = true;
    debug("PARSED SMIL: " + mo.SmilPathInZip);
    mo.Role = [];
    mo.Role.push("section");
    if ((_a = smil.Head) === null || _a === void 0 ? void 0 : _a.Meta) {
        for (const m of smil.Head.Meta) {
            if (m.Content && m.Name === "dtb:totalElapsedTime") {
                mo.totalElapsedTime = media_overlay_1.timeStrToSeconds(m.Content);
            }
        }
    }
    if (smil.Body) {
        if (smil.Body.Duration) {
            mo.duration = media_overlay_1.timeStrToSeconds(smil.Body.Duration);
        }
        if (smil.Body.EpubType) {
            const roles = exports.parseSpaceSeparatedString(smil.Body.EpubType);
            for (const role of roles) {
                if (!role.length) {
                    continue;
                }
                if (mo.Role.indexOf(role) < 0) {
                    mo.Role.push(role);
                }
            }
        }
        if (smil.Body.Class) {
            if (smil.Body.Class.indexOf("pagenum") >= 0) {
                mo.Role.push("pagebreak");
            }
            else if (smil.Body.Class.indexOf("note") >= 0) {
                mo.Role.push("note");
            }
            else if (smil.Body.Class.indexOf("sidebar") >= 0) {
                mo.Role.push("sidebar");
            }
            else if (smil.Body.Class.indexOf("annotation") >= 0) {
                mo.Role.push("annotation");
            }
        }
        else if (smil.Body.CustomTest) {
            if (smil.Body.CustomTest.indexOf("pagenum") >= 0) {
                mo.Role.push("pagebreak");
            }
            else if (smil.Body.CustomTest.indexOf("note") >= 0) {
                mo.Role.push("note");
            }
            else if (smil.Body.CustomTest.indexOf("sidebar") >= 0) {
                mo.Role.push("sidebar");
            }
            else if (smil.Body.CustomTest.indexOf("annotation") >= 0) {
                mo.Role.push("annotation");
            }
        }
        if (smil.Body.TextRef) {
            const smilBodyTextRefDecoded = smil.Body.TextRefDecoded;
            if (!smilBodyTextRefDecoded) {
                debug("!?smilBodyTextRefDecoded");
            }
            else {
                const zipPath = path.join(path.dirname(smil.ZipPath), smilBodyTextRefDecoded)
                    .replace(/\\/g, "/");
                mo.Text = zipPath;
            }
        }
        if (smil.Body.Children && smil.Body.Children.length) {
            const getDur = !smil.Body.Duration && smil.Body.Children.length === 1;
            smil.Body.Children.forEach((seqChild) => {
                if (getDur && seqChild.Duration) {
                    mo.duration = media_overlay_1.timeStrToSeconds(seqChild.Duration);
                }
                if (!mo.Children) {
                    mo.Children = [];
                }
                addSeqToMediaOverlay(smil, publication, mo, mo.Children, seqChild);
            });
        }
    }
    return;
});
exports.lazyLoadMediaOverlays = lazyLoadMediaOverlays;
const addSeqToMediaOverlay = (smil, publication, rootMO, mo, seqChild) => {
    if (!smil.ZipPath) {
        return;
    }
    const moc = new media_overlay_1.MediaOverlayNode();
    moc.initialized = rootMO.initialized;
    let doAdd = true;
    if (seqChild.Duration) {
        moc.duration = media_overlay_1.timeStrToSeconds(seqChild.Duration);
    }
    if (seqChild instanceof smil_seq_1.Seq) {
        moc.Role = [];
        moc.Role.push("section");
        const seq = seqChild;
        if (seq.ID) {
            moc.SeqID = seq.ID;
        }
        if (seq.EpubType) {
            const roles = exports.parseSpaceSeparatedString(seq.EpubType);
            for (const role of roles) {
                if (!role.length) {
                    continue;
                }
                if (moc.Role.indexOf(role) < 0) {
                    moc.Role.push(role);
                }
            }
        }
        if (seq.Class) {
            if (seq.Class.indexOf("pagenum") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("pagebreak");
            }
            else if (seq.Class.indexOf("note") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("note");
            }
            else if (seq.Class.indexOf("sidebar") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("sidebar");
            }
            else if (seq.Class.indexOf("annotation") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("annotation");
            }
        }
        else if (seq.CustomTest) {
            if (seq.CustomTest.indexOf("pagenum") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("pagebreak");
            }
            else if (seq.CustomTest.indexOf("note") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("note");
            }
            else if (seq.CustomTest.indexOf("sidebar") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("sidebar");
            }
            else if (seq.CustomTest.indexOf("annotation") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("annotation");
            }
        }
        if (seq.TextRef) {
            const seqTextRefDecoded = seq.TextRefDecoded;
            if (!seqTextRefDecoded) {
                debug("!?seqTextRefDecoded");
            }
            else {
                const zipPath = path.join(path.dirname(smil.ZipPath), seqTextRefDecoded)
                    .replace(/\\/g, "/");
                moc.Text = zipPath;
            }
        }
        if (seq.Children && seq.Children.length) {
            seq.Children.forEach((child) => {
                if (!moc.Children) {
                    moc.Children = [];
                }
                addSeqToMediaOverlay(smil, publication, rootMO, moc.Children, child);
            });
        }
    }
    else {
        const par = seqChild;
        if (par.ID) {
            moc.ParID = par.ID;
        }
        if (par.EpubType) {
            const roles = exports.parseSpaceSeparatedString(par.EpubType);
            for (const role of roles) {
                if (!role.length) {
                    continue;
                }
                if (!moc.Role) {
                    moc.Role = [];
                }
                if (moc.Role.indexOf(role) < 0) {
                    moc.Role.push(role);
                }
            }
        }
        if (par.Class) {
            if (par.Class.indexOf("pagenum") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("pagebreak");
            }
            else if (par.Class.indexOf("note") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("note");
            }
            else if (par.Class.indexOf("sidebar") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("sidebar");
            }
            else if (par.Class.indexOf("annotation") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("annotation");
            }
        }
        else if (par.CustomTest) {
            if (par.CustomTest.indexOf("pagenum") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("pagebreak");
            }
            else if (par.CustomTest.indexOf("note") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("note");
            }
            else if (par.CustomTest.indexOf("sidebar") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("sidebar");
            }
            else if (par.CustomTest.indexOf("annotation") >= 0) {
                if (!moc.Role) {
                    moc.Role = [];
                }
                moc.Role.push("annotation");
            }
        }
        if (par.Text && par.Text.Src) {
            const parTextSrcDcoded = par.Text.SrcDecoded;
            if (!parTextSrcDcoded) {
                debug("?!parTextSrcDcoded");
            }
            else {
                const zipPath = path.join(path.dirname(smil.ZipPath), parTextSrcDcoded)
                    .replace(/\\/g, "/");
                moc.Text = zipPath;
            }
        }
        if (par.Audio && par.Audio.Src) {
            const parAudioSrcDcoded = par.Audio.SrcDecoded;
            if (!parAudioSrcDcoded) {
                debug("?!parAudioSrcDcoded");
            }
            else {
                const zipPath = path.join(path.dirname(smil.ZipPath), parAudioSrcDcoded)
                    .replace(/\\/g, "/");
                moc.Audio = zipPath;
                moc.Audio += "#t=";
                const begin = par.Audio.ClipBegin ? media_overlay_1.timeStrToSeconds(par.Audio.ClipBegin) : 0;
                moc.AudioClipBegin = begin;
                const end = par.Audio.ClipEnd ? media_overlay_1.timeStrToSeconds(par.Audio.ClipEnd) : 0;
                moc.AudioClipEnd = end;
                moc.Audio += begin.toString();
                if (par.Audio.ClipEnd) {
                    moc.Audio += ",";
                    moc.Audio += end.toString();
                }
            }
        }
        if (par.Img && par.Img.Src) {
            const parImgSrcDcoded = par.Img.SrcDecoded;
            if (!parImgSrcDcoded) {
                debug("?!parImgSrcDcoded");
            }
            else {
                const zipPath = path.join(path.dirname(smil.ZipPath), parImgSrcDcoded)
                    .replace(/\\/g, "/");
                debug("SMIL IMG skipped: " + zipPath);
            }
            if (!par.Audio && !par.Text) {
                moc.initialized = false;
                doAdd = false;
            }
        }
    }
    if (doAdd) {
        mo.push(moc);
    }
    else {
        debug("SMIL MO skip: ", moc, seqChild);
    }
};
const updateDurations = (dur, link) => {
    if (!dur || !link.MediaOverlays) {
        return;
    }
    if (!link.Duration) {
        link.Duration = dur;
    }
    if (link.Alternate) {
        for (const altLink of link.Alternate) {
            if (altLink.TypeLink === "application/vnd.syncnarr+json") {
                if (!altLink.Duration) {
                    altLink.Duration = dur;
                }
            }
        }
    }
};
exports.updateDurations = updateDurations;
//# sourceMappingURL=epub-daisy-common.js.map