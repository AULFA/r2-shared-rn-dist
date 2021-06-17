"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaOverlay = exports.getAllMediaOverlays = exports.EpubParsePromise = exports.isEPUBlication = exports.EPUBis = exports.addCoverDimensions = exports.mediaOverlayURLParam = exports.mediaOverlayURLPath = exports.BCP47_UNKNOWN_LANG = void 0;
const debug_ = require("debug");
const image_size_1 = require("image-size");
const moment = require("moment");
const path = require("path");
const rnfs = require("react-native-fs");
const url_1 = require("url");
const xmldom = require("xmldom");
const xpath = require("xpath");
const media_overlay_1 = require("../models/media-overlay");
const metadata_1 = require("../models/metadata");
const metadata_belongsto_1 = require("../models/metadata-belongsto");
const metadata_contributor_1 = require("../models/metadata-contributor");
const metadata_properties_1 = require("../models/metadata-properties");
const publication_1 = require("../models/publication");
const publication_link_1 = require("../models/publication-link");
const metadata_encrypted_1 = require("r2-lcp-rn/dist/es8-es2017/src/models/metadata-encrypted");
const lcp_1 = require("r2-lcp-rn/dist/es8-es2017/src/parser/epub/lcp");
const serializable_1 = require("r2-lcp-rn/dist/es8-es2017/src/serializable");
const UrlUtils_1 = require("r2-utils-rn/dist/es8-es2017/src/_utils/http/UrlUtils");
const BufferUtils_1 = require("r2-utils-rn/dist/es8-es2017/src/_utils/stream/BufferUtils");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es8-es2017/src/_utils/xml-js-mapper");
const zipFactory_1 = require("r2-utils-rn/dist/es8-es2017/src/_utils/zip/zipFactory");
const decodeURI_1 = require("../_utils/decodeURI");
const zipHasEntry_1 = require("../_utils/zipHasEntry");
const epub_daisy_common_1 = require("./epub-daisy-common");
const container_1 = require("./epub/container");
const display_options_1 = require("./epub/display-options");
const encryption_1 = require("./epub/encryption");
const debug = debug_("r2:shared#parser/epub");
exports.BCP47_UNKNOWN_LANG = epub_daisy_common_1.BCP47_UNKNOWN_LANG;
exports.mediaOverlayURLPath = epub_daisy_common_1.mediaOverlayURLPath;
exports.mediaOverlayURLParam = epub_daisy_common_1.mediaOverlayURLParam;
const addCoverDimensions = async (publication, coverLink) => {
    const zipInternal = publication.findFromInternal("zip");
    if (zipInternal) {
        const zip = zipInternal.Value;
        const coverLinkHrefDecoded = coverLink.HrefDecoded;
        if (!coverLinkHrefDecoded) {
            return;
        }
        const has = await zipHasEntry_1.zipHasEntry(zip, coverLinkHrefDecoded, coverLink.Href);
        if (!has) {
            debug(`NOT IN ZIP (addCoverDimensions): ${coverLink.Href} --- ${coverLinkHrefDecoded}`);
            const zipEntries = await zip.getEntries();
            for (const zipEntry of zipEntries) {
                debug(zipEntry);
            }
            return;
        }
        let zipStream;
        try {
            zipStream = await zip.entryStreamPromise(coverLinkHrefDecoded);
        }
        catch (err) {
            debug(coverLinkHrefDecoded);
            debug(coverLink.TypeLink);
            debug(err);
            return;
        }
        let zipData;
        try {
            zipData = await BufferUtils_1.streamToBufferPromise(zipStream.stream);
            const imageInfo = image_size_1.imageSize(zipData);
            if (imageInfo && imageInfo.width && imageInfo.height) {
                coverLink.Width = imageInfo.width;
                coverLink.Height = imageInfo.height;
                if (coverLink.TypeLink &&
                    coverLink.TypeLink.replace("jpeg", "jpg").replace("+xml", "")
                        !== ("image/" + imageInfo.type)) {
                    debug(`Wrong image type? ${coverLink.TypeLink} -- ${imageInfo.type}`);
                }
            }
        }
        catch (err) {
            debug(coverLinkHrefDecoded);
            debug(coverLink.TypeLink);
            debug(err);
        }
    }
};
exports.addCoverDimensions = addCoverDimensions;
var EPUBis;
(function (EPUBis) {
    EPUBis["LocalExploded"] = "LocalExploded";
    EPUBis["LocalPacked"] = "LocalPacked";
    EPUBis["RemoteExploded"] = "RemoteExploded";
    EPUBis["RemotePacked"] = "RemotePacked";
})(EPUBis = exports.EPUBis || (exports.EPUBis = {}));
async function isEPUBlication(urlOrPath) {
    let p = urlOrPath;
    const http = UrlUtils_1.isHTTP(urlOrPath);
    if (http) {
        const url = new url_1.URL(urlOrPath);
        p = url.pathname;
    }
    else {
        try {
            await rnfs.stat(path.join(urlOrPath, "META-INF", "container.xml"));
            return EPUBis.LocalExploded;
        }
        catch (_) {
        }
    }
    const fileName = path.basename(p);
    const ext = path.extname(fileName).toLowerCase();
    const epub = /\.epub[3]?$/.test(ext);
    if (epub) {
        return http ? EPUBis.RemotePacked : EPUBis.LocalPacked;
    }
    if (/META-INF[\/|\\]container.xml$/.test(p)) {
        return http ? EPUBis.RemoteExploded : EPUBis.LocalExploded;
    }
    return undefined;
}
exports.isEPUBlication = isEPUBlication;
async function EpubParsePromise(filePath) {
    const isAnEPUB = await isEPUBlication(filePath);
    let filePathToLoad = filePath;
    if (isAnEPUB === EPUBis.LocalExploded) {
        filePathToLoad = filePathToLoad.replace(/META-INF[\/|\\]container.xml$/, "");
    }
    else if (isAnEPUB === EPUBis.RemoteExploded) {
        const url = new url_1.URL(filePathToLoad);
        url.pathname = url.pathname.replace(/META-INF[\/|\\]container.xml$/, "");
        filePathToLoad = url.toString();
    }
    let zip;
    try {
        zip = await zipFactory_1.zipLoadPromise(filePathToLoad);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    if (!zip.hasEntries()) {
        return Promise.reject("EPUB zip empty");
    }
    const publication = new publication_1.Publication();
    publication.Context = ["https://readium.org/webpub-manifest/context.jsonld"];
    publication.Metadata = new metadata_1.Metadata();
    publication.Metadata.RDFType = "http://schema.org/Book";
    publication.Metadata.Modified = moment(Date.now()).toDate();
    publication.AddToInternal("filename", path.basename(filePath));
    publication.AddToInternal("type", "epub");
    publication.AddToInternal("zip", zip);
    let lcpl;
    const lcplZipPath = "META-INF/license.lcpl";
    let has = await zipHasEntry_1.zipHasEntry(zip, lcplZipPath, undefined);
    if (has) {
        let lcplZipStream_;
        try {
            lcplZipStream_ = await zip.entryStreamPromise(lcplZipPath);
        }
        catch (err) {
            debug(err);
            return Promise.reject(err);
        }
        const lcplZipStream = lcplZipStream_.stream;
        let lcplZipData;
        try {
            lcplZipData = await BufferUtils_1.streamToBufferPromise(lcplZipStream);
        }
        catch (err) {
            debug(err);
            return Promise.reject(err);
        }
        const lcplStr = lcplZipData.toString("utf8");
        const lcplJson = global.JSON.parse(lcplStr);
        lcpl = serializable_1.TaJsonDeserialize(lcplJson, lcp_1.LCP);
        lcpl.ZipPath = lcplZipPath;
        lcpl.JsonSource = lcplStr;
        lcpl.init();
        publication.LCP = lcpl;
        const mime = "application/vnd.readium.lcp.license.v1.0+json";
        publication.AddLink(mime, ["license"], lcpl.ZipPath, undefined);
    }
    let encryption;
    const encZipPath = "META-INF/encryption.xml";
    has = await zipHasEntry_1.zipHasEntry(zip, encZipPath, undefined);
    if (has) {
        let encryptionXmlZipStream_;
        try {
            encryptionXmlZipStream_ = await zip.entryStreamPromise(encZipPath);
        }
        catch (err) {
            debug(err);
            return Promise.reject(err);
        }
        const encryptionXmlZipStream = encryptionXmlZipStream_.stream;
        let encryptionXmlZipData;
        try {
            encryptionXmlZipData = await BufferUtils_1.streamToBufferPromise(encryptionXmlZipStream);
        }
        catch (err) {
            debug(err);
            return Promise.reject(err);
        }
        const encryptionXmlStr = encryptionXmlZipData.toString("utf8");
        const encryptionXmlDoc = new xmldom.DOMParser().parseFromString(encryptionXmlStr);
        encryption = xml_js_mapper_1.XML.deserialize(encryptionXmlDoc, encryption_1.Encryption);
        encryption.ZipPath = encZipPath;
    }
    const containerZipPath = "META-INF/container.xml";
    let containerXmlZipStream_;
    try {
        containerXmlZipStream_ = await zip.entryStreamPromise(containerZipPath);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    const containerXmlZipStream = containerXmlZipStream_.stream;
    let containerXmlZipData;
    try {
        containerXmlZipData = await BufferUtils_1.streamToBufferPromise(containerXmlZipStream);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    const containerXmlStr = containerXmlZipData.toString("utf8");
    const containerXmlDoc = new xmldom.DOMParser().parseFromString(containerXmlStr);
    const container = xml_js_mapper_1.XML.deserialize(containerXmlDoc, container_1.Container);
    container.ZipPath = containerZipPath;
    const rootfile = container.Rootfile[0];
    const rootfilePathDecoded = rootfile.PathDecoded;
    if (!rootfilePathDecoded) {
        return Promise.reject("?!rootfile.PathDecoded");
    }
    const opf = await epub_daisy_common_1.getOpf(zip, rootfilePathDecoded, rootfile.Path);
    epub_daisy_common_1.addLanguage(publication, opf);
    epub_daisy_common_1.addTitle(publication, rootfile, opf);
    epub_daisy_common_1.addIdentifier(publication, opf);
    epub_daisy_common_1.addOtherMetadata(publication, rootfile, opf);
    epub_daisy_common_1.setPublicationDirection(publication, opf);
    epub_daisy_common_1.findContributorInMeta(publication, rootfile, opf);
    await epub_daisy_common_1.fillSpineAndResource(publication, rootfile, opf, zip, addLinkData);
    await addRendition(publication, opf, zip);
    await addCoverRel(publication, rootfile, opf, zip);
    if (encryption) {
        fillEncryptionInfo(publication, encryption, lcpl);
    }
    await fillTOCFromNavDoc(publication, zip);
    if (!publication.TOC || !publication.TOC.length) {
        let ncx;
        if (opf.Manifest && opf.Spine.Toc) {
            const ncxManItem = opf.Manifest.find((manifestItem) => {
                return manifestItem.ID === opf.Spine.Toc;
            });
            if (ncxManItem) {
                ncx = await epub_daisy_common_1.getNcx(ncxManItem, opf, zip);
            }
        }
        epub_daisy_common_1.fillTOC(publication, opf, ncx);
    }
    if (!publication.PageList && publication.Resources) {
        const pageMapLink = publication.Resources.find((item) => {
            return item.TypeLink === "application/oebps-page-map+xml";
        });
        if (pageMapLink) {
            await fillPageListFromAdobePageMap(publication, zip, pageMapLink);
        }
    }
    fillCalibreSerieInfo(publication, opf);
    epub_daisy_common_1.fillSubject(publication, opf);
    epub_daisy_common_1.fillPublicationDate(publication, rootfile, opf);
    return publication;
}
exports.EpubParsePromise = EpubParsePromise;
async function getAllMediaOverlays(publication) {
    const mos = [];
    const links = [].
        concat(publication.Spine ? publication.Spine : []).
        concat(publication.Resources ? publication.Resources : []);
    for (const link of links) {
        if (link.MediaOverlays) {
            const mo = link.MediaOverlays;
            if (!mo.initialized) {
                try {
                    await epub_daisy_common_1.lazyLoadMediaOverlays(publication, mo);
                }
                catch (err) {
                    return Promise.reject(err);
                }
            }
            mos.push(mo);
        }
    }
    return Promise.resolve(mos);
}
exports.getAllMediaOverlays = getAllMediaOverlays;
async function getMediaOverlay(publication, spineHref) {
    const links = [].
        concat(publication.Spine ? publication.Spine : []).
        concat(publication.Resources ? publication.Resources : []);
    for (const link of links) {
        if (link.MediaOverlays && link.Href.indexOf(spineHref) >= 0) {
            const mo = link.MediaOverlays;
            if (!mo.initialized) {
                try {
                    await epub_daisy_common_1.lazyLoadMediaOverlays(publication, mo);
                }
                catch (err) {
                    return Promise.reject(err);
                }
            }
            return Promise.resolve(mo);
        }
    }
    return Promise.reject(`No Media Overlays ${spineHref}`);
}
exports.getMediaOverlay = getMediaOverlay;
const addRelAndPropertiesToLink = async (publication, link, linkEpub, opf) => {
    if (linkEpub.Properties) {
        await addToLinkFromProperties(publication, link, linkEpub.Properties);
    }
    const spineProperties = findPropertiesInSpineForManifest(linkEpub, opf);
    if (spineProperties) {
        await addToLinkFromProperties(publication, link, spineProperties);
    }
};
const addToLinkFromProperties = async (publication, link, propertiesString) => {
    const properties = epub_daisy_common_1.parseSpaceSeparatedString(propertiesString);
    const propertiesStruct = new metadata_properties_1.Properties();
    for (const p of properties) {
        switch (p) {
            case "cover-image": {
                link.AddRel("cover");
                await exports.addCoverDimensions(publication, link);
                break;
            }
            case "nav": {
                link.AddRel("contents");
                break;
            }
            case "scripted": {
                if (!propertiesStruct.Contains) {
                    propertiesStruct.Contains = [];
                }
                propertiesStruct.Contains.push("js");
                break;
            }
            case "mathml": {
                if (!propertiesStruct.Contains) {
                    propertiesStruct.Contains = [];
                }
                propertiesStruct.Contains.push("mathml");
                break;
            }
            case "onix-record": {
                if (!propertiesStruct.Contains) {
                    propertiesStruct.Contains = [];
                }
                propertiesStruct.Contains.push("onix");
                break;
            }
            case "svg": {
                if (!propertiesStruct.Contains) {
                    propertiesStruct.Contains = [];
                }
                propertiesStruct.Contains.push("svg");
                break;
            }
            case "xmp-record": {
                if (!propertiesStruct.Contains) {
                    propertiesStruct.Contains = [];
                }
                propertiesStruct.Contains.push("xmp");
                break;
            }
            case "remote-resources": {
                if (!propertiesStruct.Contains) {
                    propertiesStruct.Contains = [];
                }
                propertiesStruct.Contains.push("remote-resources");
                break;
            }
            case "page-spread-left": {
                propertiesStruct.Page = metadata_properties_1.PageEnum.Left;
                break;
            }
            case "page-spread-right": {
                propertiesStruct.Page = metadata_properties_1.PageEnum.Right;
                break;
            }
            case "page-spread-center": {
                propertiesStruct.Page = metadata_properties_1.PageEnum.Center;
                break;
            }
            case "rendition:spread-none": {
                propertiesStruct.Spread = metadata_properties_1.SpreadEnum.None;
                break;
            }
            case "rendition:spread-auto": {
                propertiesStruct.Spread = metadata_properties_1.SpreadEnum.Auto;
                break;
            }
            case "rendition:spread-landscape": {
                propertiesStruct.Spread = metadata_properties_1.SpreadEnum.Landscape;
                break;
            }
            case "rendition:spread-portrait": {
                propertiesStruct.Spread = metadata_properties_1.SpreadEnum.Both;
                break;
            }
            case "rendition:spread-both": {
                propertiesStruct.Spread = metadata_properties_1.SpreadEnum.Both;
                break;
            }
            case "rendition:layout-reflowable": {
                propertiesStruct.Layout = metadata_properties_1.LayoutEnum.Reflowable;
                break;
            }
            case "rendition:layout-pre-paginated": {
                propertiesStruct.Layout = metadata_properties_1.LayoutEnum.Fixed;
                break;
            }
            case "rendition:orientation-auto": {
                propertiesStruct.Orientation = metadata_properties_1.OrientationEnum.Auto;
                break;
            }
            case "rendition:orientation-landscape": {
                propertiesStruct.Orientation = metadata_properties_1.OrientationEnum.Landscape;
                break;
            }
            case "rendition:orientation-portrait": {
                propertiesStruct.Orientation = metadata_properties_1.OrientationEnum.Portrait;
                break;
            }
            case "rendition:flow-auto": {
                propertiesStruct.Overflow = metadata_properties_1.OverflowEnum.Auto;
                break;
            }
            case "rendition:flow-paginated": {
                propertiesStruct.Overflow = metadata_properties_1.OverflowEnum.Paginated;
                break;
            }
            case "rendition:flow-scrolled-continuous": {
                propertiesStruct.Overflow = metadata_properties_1.OverflowEnum.ScrolledContinuous;
                break;
            }
            case "rendition:flow-scrolled-doc": {
                propertiesStruct.Overflow = metadata_properties_1.OverflowEnum.Scrolled;
                break;
            }
            default: {
                break;
            }
        }
        if (propertiesStruct.Layout ||
            propertiesStruct.Orientation ||
            propertiesStruct.Overflow ||
            propertiesStruct.Page ||
            propertiesStruct.Spread ||
            (propertiesStruct.Contains && propertiesStruct.Contains.length)) {
            link.Properties = propertiesStruct;
        }
    }
};
const addMediaOverlay = async (link, linkEpub, opf, zip) => {
    if (linkEpub.MediaOverlay) {
        const meta = epub_daisy_common_1.findMetaByRefineAndProperty(opf, linkEpub.MediaOverlay, "media:duration");
        if (meta) {
            link.Duration = media_overlay_1.timeStrToSeconds(meta.Data);
        }
        const manItemSmil = opf.Manifest.find((mi) => {
            if (mi.ID === linkEpub.MediaOverlay) {
                return true;
            }
            return false;
        });
        if (manItemSmil) {
            await epub_daisy_common_1.addMediaOverlaySMIL(link, manItemSmil, opf, zip);
        }
    }
};
const addRendition = async (publication, opf, zip) => {
    if (opf.Metadata && opf.Metadata.Meta && opf.Metadata.Meta.length) {
        const rendition = new metadata_properties_1.Properties();
        opf.Metadata.Meta.forEach((meta) => {
            switch (meta.Property) {
                case "rendition:layout": {
                    switch (meta.Data) {
                        case "pre-paginated": {
                            rendition.Layout = metadata_properties_1.LayoutEnum.Fixed;
                            break;
                        }
                        case "reflowable": {
                            rendition.Layout = metadata_properties_1.LayoutEnum.Reflowable;
                            break;
                        }
                    }
                    break;
                }
                case "rendition:orientation": {
                    switch (meta.Data) {
                        case "auto": {
                            rendition.Orientation = metadata_properties_1.OrientationEnum.Auto;
                            break;
                        }
                        case "landscape": {
                            rendition.Orientation = metadata_properties_1.OrientationEnum.Landscape;
                            break;
                        }
                        case "portrait": {
                            rendition.Orientation = metadata_properties_1.OrientationEnum.Portrait;
                            break;
                        }
                    }
                    break;
                }
                case "rendition:spread": {
                    switch (meta.Data) {
                        case "auto": {
                            rendition.Spread = metadata_properties_1.SpreadEnum.Auto;
                            break;
                        }
                        case "both": {
                            rendition.Spread = metadata_properties_1.SpreadEnum.Both;
                            break;
                        }
                        case "none": {
                            rendition.Spread = metadata_properties_1.SpreadEnum.None;
                            break;
                        }
                        case "landscape": {
                            rendition.Spread = metadata_properties_1.SpreadEnum.Landscape;
                            break;
                        }
                        case "portrait": {
                            rendition.Spread = metadata_properties_1.SpreadEnum.Both;
                            break;
                        }
                    }
                    break;
                }
                case "rendition:flow": {
                    switch (meta.Data) {
                        case "auto": {
                            rendition.Overflow = metadata_properties_1.OverflowEnum.Auto;
                            break;
                        }
                        case "paginated": {
                            rendition.Overflow = metadata_properties_1.OverflowEnum.Paginated;
                            break;
                        }
                        case "scrolled": {
                            rendition.Overflow = metadata_properties_1.OverflowEnum.Scrolled;
                            break;
                        }
                        case "scrolled-continuous": {
                            rendition.Overflow = metadata_properties_1.OverflowEnum.ScrolledContinuous;
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
        if (!rendition.Layout || !rendition.Orientation) {
            let displayOptionsZipPath = "META-INF/com.apple.ibooks.display-options.xml";
            let has = await zipHasEntry_1.zipHasEntry(zip, displayOptionsZipPath, undefined);
            if (has) {
                debug("Info: found iBooks display-options XML");
            }
            else {
                displayOptionsZipPath = "META-INF/com.kobobooks.display-options.xml";
                has = await zipHasEntry_1.zipHasEntry(zip, displayOptionsZipPath, undefined);
                if (has) {
                    debug("Info: found Kobo display-options XML");
                }
            }
            if (!has) {
                debug("Info: not found iBooks or Kobo display-options XML");
            }
            else {
                let displayOptionsZipStream_;
                try {
                    displayOptionsZipStream_ = await zip.entryStreamPromise(displayOptionsZipPath);
                }
                catch (err) {
                    debug(err);
                }
                if (displayOptionsZipStream_) {
                    const displayOptionsZipStream = displayOptionsZipStream_.stream;
                    let displayOptionsZipData;
                    try {
                        displayOptionsZipData = await BufferUtils_1.streamToBufferPromise(displayOptionsZipStream);
                    }
                    catch (err) {
                        debug(err);
                    }
                    if (displayOptionsZipData) {
                        try {
                            const displayOptionsStr = displayOptionsZipData.toString("utf8");
                            const displayOptionsDoc = new xmldom.DOMParser().parseFromString(displayOptionsStr);
                            const displayOptions = xml_js_mapper_1.XML.deserialize(displayOptionsDoc, display_options_1.DisplayOptions);
                            displayOptions.ZipPath = displayOptionsZipPath;
                            if (displayOptions && displayOptions.Platforms) {
                                const renditionPlatformAll = new metadata_properties_1.Properties();
                                const renditionPlatformIpad = new metadata_properties_1.Properties();
                                const renditionPlatformIphone = new metadata_properties_1.Properties();
                                displayOptions.Platforms.forEach((platform) => {
                                    if (platform.Options) {
                                        platform.Options.forEach((option) => {
                                            if (!rendition.Layout) {
                                                if (option.Name === "fixed-layout") {
                                                    if (option.Value === "true") {
                                                        rendition.Layout = metadata_properties_1.LayoutEnum.Fixed;
                                                    }
                                                    else {
                                                        rendition.Layout = metadata_properties_1.LayoutEnum.Reflowable;
                                                    }
                                                }
                                            }
                                            if (!rendition.Orientation) {
                                                if (option.Name === "orientation-lock") {
                                                    const rend = platform.Name === "*" ? renditionPlatformAll :
                                                        (platform.Name === "ipad" ? renditionPlatformIpad :
                                                            (platform.Name === "iphone" ? renditionPlatformIphone :
                                                                renditionPlatformAll));
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
                                if (renditionPlatformAll.Orientation) {
                                    rendition.Orientation = renditionPlatformAll.Orientation;
                                }
                                else if (renditionPlatformIpad.Orientation) {
                                    rendition.Orientation = renditionPlatformIpad.Orientation;
                                }
                                else if (renditionPlatformIphone.Orientation) {
                                    rendition.Orientation = renditionPlatformIphone.Orientation;
                                }
                            }
                        }
                        catch (err) {
                            debug(err);
                        }
                    }
                }
            }
        }
        if (rendition.Layout || rendition.Orientation || rendition.Overflow || rendition.Page || rendition.Spread) {
            publication.Metadata.Rendition = rendition;
        }
    }
};
const addLinkData = async (publication, rootfile, opf, zip, linkItem, item) => {
    if (rootfile) {
        await addRelAndPropertiesToLink(publication, linkItem, item, opf);
    }
    await addMediaOverlay(linkItem, item, opf, zip);
};
const fillEncryptionInfo = (publication, encryption, lcp) => {
    encryption.EncryptedData.forEach((encInfo) => {
        const encrypted = new metadata_encrypted_1.Encrypted();
        encrypted.Algorithm = encInfo.EncryptionMethod.Algorithm;
        if (lcp &&
            encrypted.Algorithm !== "http://www.idpf.org/2008/embedding" &&
            encrypted.Algorithm !== "http://ns.adobe.com/pdf/enc#RC") {
            encrypted.Profile = lcp.Encryption.Profile;
            encrypted.Scheme = "http://readium.org/2014/01/lcp";
        }
        if (encInfo.EncryptionProperties && encInfo.EncryptionProperties.length) {
            encInfo.EncryptionProperties.forEach((prop) => {
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
            publication.Resources.forEach((l) => {
                const filePath = l.Href;
                if (filePath === encInfo.CipherData.CipherReference.URI) {
                    if (!l.Properties) {
                        l.Properties = new metadata_properties_1.Properties();
                    }
                    l.Properties.Encrypted = encrypted;
                }
            });
        }
        if (publication.Spine) {
            publication.Spine.forEach((l) => {
                const filePath = l.Href;
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
const fillPageListFromAdobePageMap = async (publication, zip, l) => {
    if (!l.HrefDecoded) {
        return;
    }
    const pageMapContent = await epub_daisy_common_1.loadFileStrFromZipPath(l.Href, l.HrefDecoded, zip);
    if (!pageMapContent) {
        return;
    }
    const pageMapXmlDoc = new xmldom.DOMParser().parseFromString(pageMapContent);
    const pages = pageMapXmlDoc.getElementsByTagName("page");
    if (pages && pages.length) {
        for (let i = 0; i < pages.length; i += 1) {
            const page = pages.item(i);
            const link = new publication_link_1.Link();
            const href = page.getAttribute("href");
            const title = page.getAttribute("name");
            if (href === null || title === null) {
                continue;
            }
            if (!publication.PageList) {
                publication.PageList = [];
            }
            const hrefDecoded = decodeURI_1.tryDecodeURI(href);
            if (!hrefDecoded) {
                continue;
            }
            const zipPath = path.join(path.dirname(l.HrefDecoded), hrefDecoded)
                .replace(/\\/g, "/");
            link.setHrefDecoded(zipPath);
            link.Title = title;
            publication.PageList.push(link);
        }
    }
};
const fillCalibreSerieInfo = (publication, opf) => {
    let serie;
    let seriePosition;
    if (opf.Metadata && opf.Metadata.Meta && opf.Metadata.Meta.length) {
        opf.Metadata.Meta.forEach((m) => {
            if (m.Name === "calibre:series") {
                serie = m.Content;
            }
            if (m.Name === "calibre:series_index") {
                seriePosition = parseFloat(m.Content);
            }
        });
    }
    if (serie) {
        const contributor = new metadata_contributor_1.Contributor();
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
const fillTOCFromNavDoc = async (publication, zip) => {
    const navLink = publication.GetNavDoc();
    if (!navLink) {
        return;
    }
    const navLinkHrefDecoded = navLink.HrefDecoded;
    if (!navLinkHrefDecoded) {
        debug("!?navLink.HrefDecoded");
        return;
    }
    const has = await zipHasEntry_1.zipHasEntry(zip, navLinkHrefDecoded, navLink.Href);
    if (!has) {
        debug(`NOT IN ZIP (fillTOCFromNavDoc): ${navLink.Href} --- ${navLinkHrefDecoded}`);
        const zipEntries = await zip.getEntries();
        for (const zipEntry of zipEntries) {
            debug(zipEntry);
        }
        return;
    }
    let navDocZipStream_;
    try {
        navDocZipStream_ = await zip.entryStreamPromise(navLinkHrefDecoded);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    const navDocZipStream = navDocZipStream_.stream;
    let navDocZipData;
    try {
        navDocZipData = await BufferUtils_1.streamToBufferPromise(navDocZipStream);
    }
    catch (err) {
        debug(err);
        return Promise.reject(err);
    }
    const navDocStr = navDocZipData.toString("utf8");
    const navXmlDoc = new xmldom.DOMParser().parseFromString(navDocStr);
    const select = xpath.useNamespaces({
        epub: "http://www.idpf.org/2007/ops",
        xhtml: "http://www.w3.org/1999/xhtml",
    });
    const navs = select("/xhtml:html/xhtml:body//xhtml:nav", navXmlDoc);
    if (navs && navs.length) {
        navs.forEach((navElement) => {
            const epubType = select("@epub:type", navElement);
            if (epubType && epubType.length) {
                const olElem = select("xhtml:ol", navElement);
                const rolesString = epubType[0].value;
                const rolesArray = epub_daisy_common_1.parseSpaceSeparatedString(rolesString);
                if (rolesArray.length) {
                    for (const role of rolesArray) {
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
};
const fillTOCFromNavDocWithOL = (select, olElems, children, navDocPath) => {
    olElems.forEach((olElem) => {
        const liElems = select("xhtml:li", olElem);
        if (liElems && liElems.length) {
            liElems.forEach((liElem) => {
                const link = new publication_link_1.Link();
                children.push(link);
                const aElems = select("xhtml:a", liElem);
                if (aElems && aElems.length > 0) {
                    const epubType = select("@epub:type", aElems[0]);
                    if (epubType && epubType.length) {
                        const rolesString = epubType[0].value;
                        const rolesArray = epub_daisy_common_1.parseSpaceSeparatedString(rolesString);
                        if (rolesArray.length) {
                            link.AddRels(rolesArray);
                        }
                    }
                    const aHref = select("@href", aElems[0]);
                    if (aHref && aHref.length) {
                        const val = aHref[0].value;
                        let valDecoded = decodeURI_1.tryDecodeURI(val);
                        if (!valDecoded) {
                            debug("!?valDecoded");
                            return;
                        }
                        if (val[0] === "#") {
                            valDecoded = path.basename(navDocPath) + valDecoded;
                        }
                        const zipPath = path.join(path.dirname(navDocPath), valDecoded)
                            .replace(/\\/g, "/");
                        link.setHrefDecoded(zipPath);
                    }
                    let aText = aElems[0].textContent;
                    if (aText && aText.length) {
                        aText = aText.trim();
                        aText = aText.replace(/\s\s+/g, " ");
                        link.Title = aText;
                    }
                }
                else {
                    const liFirstChild = select("xhtml:*[1]", liElem);
                    if (liFirstChild && liFirstChild.length && liFirstChild[0].textContent) {
                        link.Title = liFirstChild[0].textContent.trim();
                    }
                }
                const olElemsNext = select("xhtml:ol", liElem);
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
const addCoverRel = async (publication, rootfile, opf, zip) => {
    let coverID;
    if (opf.Metadata && opf.Metadata.Meta && opf.Metadata.Meta.length) {
        opf.Metadata.Meta.find((meta) => {
            if (meta.Name === "cover") {
                coverID = meta.Content;
                return true;
            }
            return false;
        });
    }
    if (coverID) {
        let manifestInfo;
        try {
            manifestInfo = await epub_daisy_common_1.findInManifestByID(publication, rootfile, opf, coverID, zip, addLinkData);
        }
        catch (err) {
            debug(err);
            return;
        }
        if (manifestInfo && manifestInfo.Href && publication.Resources && publication.Resources.length) {
            const href = manifestInfo.Href;
            const linky = publication.Resources.find((item) => {
                if (item.Href === href) {
                    return true;
                }
                return false;
            });
            if (linky) {
                linky.AddRel("cover");
                await exports.addCoverDimensions(publication, linky);
            }
        }
    }
};
const findPropertiesInSpineForManifest = (linkEpub, opf) => {
    if (opf.Spine && opf.Spine.Items && opf.Spine.Items.length) {
        const it = opf.Spine.Items.find((item) => {
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