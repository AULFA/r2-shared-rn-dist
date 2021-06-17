"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDaisyToReadiumWebPub = void 0;
const debug_ = require("debug");
const path = require("path");
const rnfs = require("react-native-fs");
const xmldom = require("xmldom");
const xpath = require("xpath");
const yazl_1 = require("yazl");
const media_overlay_1 = require("../models/media-overlay");
const metadata_1 = require("../models/metadata");
const metadata_properties_1 = require("../models/metadata-properties");
const publication_link_1 = require("../models/publication-link");
const serializable_1 = require("r2-lcp-rn/dist/es8-es2017/src/serializable");
const epub_daisy_common_1 = require("./epub-daisy-common");
const debug = debug_("r2:shared#parser/daisy-convert-to-epub");
async function ensureDirs(fspath) {
    const dirname = path.dirname(fspath);
    await rnfs.mkdir(dirname);
}
const convertDaisyToReadiumWebPub = async (outputDirPath, publication) => {
    return new Promise(async (resolve, reject) => {
        var _a, _b, _c, _d, _e;
        const isFullTextAudio = ((_a = publication.Metadata) === null || _a === void 0 ? void 0 : _a.AdditionalJSON) &&
            publication.Metadata.AdditionalJSON["dtb:multimediaType"] === "audioFullText";
        const isAudioOnly = ((_b = publication.Metadata) === null || _b === void 0 ? void 0 : _b.AdditionalJSON) &&
            publication.Metadata.AdditionalJSON["dtb:multimediaType"] === "audioNCX";
        const isTextOnly = ((_c = publication.Metadata) === null || _c === void 0 ? void 0 : _c.AdditionalJSON) &&
            publication.Metadata.AdditionalJSON["dtb:multimediaType"] === "textNCX";
        const zipInternal = publication.findFromInternal("zip");
        if (!zipInternal) {
            debug("No publication zip!?");
            return reject("No publication zip!?");
        }
        const zip = zipInternal.Value;
        const outputZipPath = path.join(outputDirPath, `${isAudioOnly ? "daisy_audioNCX" : (isTextOnly ? "daisy_textNCX" : "daisy_audioFullText")}-to-epub.webpub`);
        await ensureDirs(outputZipPath);
        let timeoutId;
        const zipfile = new yazl_1.ZipFile();
        try {
            const zipContent = zipfile.outputStream.read();
            if (zipContent != null) {
                rnfs.writeFile(outputZipPath, zipContent.toString())
                    .then(() => {
                    debug("ZIP close");
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = undefined;
                        resolve(outputZipPath);
                    }
                })
                    .catch((e) => {
                    debug("ZIP error", e);
                    reject(e);
                });
            }
            else {
                debug("ZIP error: zip content is null");
                reject("zip content is null");
            }
            const select = xpath.useNamespaces({
                dtbook: "http://www.daisy.org/z3986/2005/dtbook/",
            });
            const elementNames = [
                "address",
                "annoref",
                "annotation",
                "author",
                "bdo",
                "bodymatter",
                "book",
                "bridgehead",
                "byline",
                "caption",
                "cite",
                "col",
                "colgroup",
                "covertitle",
                "dateline",
                "dfn",
                "docauthor",
                "doctitle",
                "dtbook",
                "epigraph",
                "frontmatter",
                "hd",
                "imggroup",
                "kbd",
                "level",
                "levelhd",
                "level1",
                "level2",
                "level3",
                "level4",
                "level5",
                "level6",
                "lic",
                "line",
                "linegroup",
                "linenum",
                "link",
                "list",
                "note",
                "noteref",
                "pagenum",
                "poem",
                "prodnote",
                "rearmatter",
                "samp",
                "sent",
                "sub",
                "sup",
                "q",
                "w",
                "notice",
                "sidebar",
                "blockquote",
                "abbr",
                "acronym",
                "title",
            ];
            let mediaOverlaysMap;
            const getMediaOverlaysDuration = (mo) => {
                let duration = 0;
                if (typeof mo.AudioClipBegin !== "undefined" &&
                    typeof mo.AudioClipEnd !== "undefined") {
                    duration = mo.AudioClipEnd - mo.AudioClipBegin;
                }
                else if (mo.Children) {
                    for (const child of mo.Children) {
                        duration += getMediaOverlaysDuration(child);
                    }
                }
                return duration;
            };
            const patchMediaOverlaysTextHref = (mo, audioOnlySmilHtmlHref) => {
                let smilTextRef;
                if (audioOnlySmilHtmlHref && !mo.Text && mo.Audio) {
                    smilTextRef = audioOnlySmilHtmlHref;
                    mo.Text = `${smilTextRef}#${mo.ParID || "_yyy_"}`;
                }
                else if (mo.Text) {
                    mo.Text = mo.Text.replace(/\.xml/, ".xhtml");
                    smilTextRef = mo.Text;
                    const k = smilTextRef.indexOf("#");
                    if (k > 0) {
                        smilTextRef = smilTextRef.substr(0, k);
                    }
                }
                if (mo.Children) {
                    for (const child of mo.Children) {
                        const smilTextRef_ = patchMediaOverlaysTextHref(child, audioOnlySmilHtmlHref);
                        if (!smilTextRef_) {
                            debug("########## WARNING: !smilTextRef ???!!", smilTextRef_, child);
                        }
                        else if (smilTextRef && smilTextRef !== smilTextRef_) {
                            debug("########## WARNING: smilTextRef !== smilTextRef_ ???!!", smilTextRef, smilTextRef_);
                        }
                        if (!smilTextRef) {
                            smilTextRef = smilTextRef_;
                        }
                    }
                }
                return smilTextRef;
            };
            const smilDocs = {};
            const findLinkInToc = (links, hrefDecoded) => {
                for (const link of links) {
                    if (link.HrefDecoded === hrefDecoded) {
                        return link;
                    }
                    else if (link.Children) {
                        const foundLink = findLinkInToc(link.Children, hrefDecoded);
                        if (foundLink) {
                            return foundLink;
                        }
                    }
                }
                return undefined;
            };
            const createHtmlFromSmilFile = async (smilPathInZip) => {
                let smilDoc = smilDocs[smilPathInZip];
                if (!smilDoc) {
                    const smilStr = await epub_daisy_common_1.loadFileStrFromZipPath(smilPathInZip, smilPathInZip, zip);
                    if (!smilStr) {
                        debug("!loadFileStrFromZipPath", smilStr);
                        return undefined;
                    }
                    smilDoc = new xmldom.DOMParser().parseFromString(smilStr, "application/xml");
                    smilDocs[smilPathInZip] = smilDoc;
                }
                const parEls = Array.from(smilDoc.getElementsByTagName("par"));
                for (const parEl of parEls) {
                    const audioElements = Array.from(parEl.getElementsByTagName("audio")).filter((el) => el);
                    for (const audioElement of audioElements) {
                        if (audioElement.parentNode) {
                            audioElement.parentNode.removeChild(audioElement);
                        }
                    }
                    const elmId = parEl.getAttribute("id");
                    const hrefDecoded = `${smilPathInZip}#${elmId}`;
                    const tocLinkItem = findLinkInToc(publication.TOC, hrefDecoded);
                    const text = tocLinkItem ? tocLinkItem.Title : undefined;
                    const textNode = smilDoc.createTextNode(text ? text : ".");
                    parEl.appendChild(textNode);
                }
                const bodyContent = smilDoc.getElementsByTagName("body")[0];
                const bodyContentStr = new xmldom.XMLSerializer().serializeToString(bodyContent);
                const contentStr = bodyContentStr
                    .replace(`xmlns="http://www.w3.org/2001/SMIL20/"`, "")
                    .replace(/dur=/g, "data-dur=")
                    .replace(/fill=/g, "data-fill=")
                    .replace(/customTest=/g, "data-customTest=")
                    .replace(/class=/g, "data-class=")
                    .replace(/<seq/g, '<div class="smil-seq"')
                    .replace(/<par/g, '<p class="smil-par"')
                    .replace(/<\/seq>/g, "</div>")
                    .replace(/<\/par>/g, "</p>");
                const htmlDoc = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
    <head>
        <title>${smilPathInZip}</title>
    </head>
    ${contentStr}
</html>
`;
                const htmlFilePath = smilPathInZip.replace(/\.smil$/, ".xhtml");
                zipfile.addBuffer(Buffer.from(htmlDoc), htmlFilePath);
                return htmlFilePath;
            };
            const audioOnlySmilHtmls = [];
            if (publication.Spine) {
                mediaOverlaysMap = {};
                let previousLinkItem;
                let spineIndex = -1;
                for (const linkItem of publication.Spine) {
                    spineIndex++;
                    if (!linkItem.MediaOverlays) {
                        continue;
                    }
                    if (!linkItem.MediaOverlays.initialized) {
                        await epub_daisy_common_1.lazyLoadMediaOverlays(publication, linkItem.MediaOverlays);
                        if (isFullTextAudio || isAudioOnly) {
                            epub_daisy_common_1.updateDurations(linkItem.MediaOverlays.duration, linkItem);
                        }
                    }
                    if (isFullTextAudio || isAudioOnly) {
                        const computedDur = getMediaOverlaysDuration(linkItem.MediaOverlays);
                        if (computedDur) {
                            if (!linkItem.MediaOverlays.duration) {
                                linkItem.MediaOverlays.duration = computedDur;
                                epub_daisy_common_1.updateDurations(computedDur, linkItem);
                            }
                            else {
                                if (Math.round(linkItem.MediaOverlays.duration) !== Math.round(computedDur)) {
                                    debug("linkItem.MediaOverlays.duration !== computedDur", linkItem.MediaOverlays.duration, computedDur);
                                }
                            }
                        }
                        if (previousLinkItem && previousLinkItem.MediaOverlays &&
                            typeof previousLinkItem.MediaOverlays.totalElapsedTime !== "undefined" &&
                            typeof linkItem.MediaOverlays.totalElapsedTime !== "undefined") {
                            const dur = linkItem.MediaOverlays.totalElapsedTime -
                                previousLinkItem.MediaOverlays.totalElapsedTime;
                            if (dur > 0) {
                                if (!previousLinkItem.MediaOverlays.duration) {
                                    previousLinkItem.MediaOverlays.duration = dur;
                                    epub_daisy_common_1.updateDurations(dur, previousLinkItem);
                                }
                                else {
                                    if (Math.round(previousLinkItem.MediaOverlays.duration) !== Math.round(dur)) {
                                        debug("previousLinkItem.MediaOverlays.duration !== dur", previousLinkItem.MediaOverlays.duration, dur);
                                    }
                                }
                            }
                        }
                        previousLinkItem = linkItem;
                    }
                    let smilTextRef;
                    if (isAudioOnly) {
                        const audioOnlySmilHtmlHref = (_d = linkItem.MediaOverlays.SmilPathInZip) === null || _d === void 0 ? void 0 : _d.replace(/\.smil$/, ".xhtml");
                        if (audioOnlySmilHtmlHref) {
                            smilTextRef = patchMediaOverlaysTextHref(linkItem.MediaOverlays, audioOnlySmilHtmlHref);
                        }
                    }
                    else {
                        smilTextRef = patchMediaOverlaysTextHref(linkItem.MediaOverlays, undefined);
                    }
                    if (smilTextRef) {
                        if (isAudioOnly && linkItem.MediaOverlays.SmilPathInZip) {
                            await createHtmlFromSmilFile(linkItem.MediaOverlays.SmilPathInZip);
                            const smilHtml = new publication_link_1.Link();
                            smilHtml.Href = smilTextRef;
                            smilHtml.TypeLink = "application/xhtml+xml";
                            audioOnlySmilHtmls.push(smilHtml);
                        }
                        if (!mediaOverlaysMap[smilTextRef]) {
                            mediaOverlaysMap[smilTextRef] = {
                                index: spineIndex,
                                mos: [],
                            };
                        }
                        mediaOverlaysMap[smilTextRef].index = spineIndex;
                        mediaOverlaysMap[smilTextRef].mos.push(linkItem.MediaOverlays);
                    }
                }
            }
            publication.Spine = [];
            const resourcesToKeep = [];
            const dtBooks = [...audioOnlySmilHtmls];
            for (const resLink of publication.Resources) {
                if (!resLink.HrefDecoded) {
                    continue;
                }
                if (resLink.TypeLink === "text/css" || resLink.HrefDecoded.endsWith(".css")) {
                    let cssText = await epub_daisy_common_1.loadFileStrFromZipPath(resLink.Href, resLink.HrefDecoded, zip);
                    if (!cssText) {
                        debug("!loadFileStrFromZipPath", resLink.HrefDecoded);
                        continue;
                    }
                    cssText = cssText.replace(/\/\*([\s\S]+?)\*\//gm, (_match, p1, _offset, _string) => {
                        const base64 = Buffer.from(p1).toString("base64");
                        return `/*__${base64}__*/`;
                    });
                    for (const elementName of elementNames) {
                        const regex = new RegExp(`([^#\.a-zA-Z0-9\-_])(${elementName})([^a-zA-Z0-9\-_;])`, "g");
                        cssText = cssText.replace(regex, `$1.$2_R2$3`);
                        cssText = cssText.replace(regex, `$1.$2_R2$3`);
                    }
                    cssText = cssText.replace(/\/\*__([\s\S]+?)__\*\//g, (_match, p1, _offset, _string) => {
                        const comment = Buffer.from(p1, "base64").toString("utf8");
                        return `/*${comment}*/`;
                    });
                    zipfile.addBuffer(Buffer.from(cssText), resLink.HrefDecoded);
                    resourcesToKeep.push(resLink);
                }
                else if (resLink.TypeLink === "application/x-dtbook+xml" || resLink.HrefDecoded.endsWith(".xml")) {
                    let dtBookStr = await epub_daisy_common_1.loadFileStrFromZipPath(resLink.Href, resLink.HrefDecoded, zip);
                    if (!dtBookStr) {
                        debug("!loadFileStrFromZipPath", dtBookStr);
                        continue;
                    }
                    dtBookStr = dtBookStr.replace(/xmlns=""/, " ");
                    dtBookStr = dtBookStr.replace(/<dtbook/, "<dtbook xmlns:epub=\"http://www.idpf.org/2007/ops\" ");
                    const dtBookDoc = new xmldom.DOMParser().parseFromString(dtBookStr, "application/xml");
                    let title = (_e = dtBookDoc.getElementsByTagName("doctitle")[0]) === null || _e === void 0 ? void 0 : _e.textContent;
                    if (title) {
                        title = title.trim();
                        if (!title.length) {
                            title = null;
                        }
                    }
                    const listElements = dtBookDoc.getElementsByTagName("list");
                    for (let i = 0; i < listElements.length; i++) {
                        const listElement = listElements.item(i);
                        if (!listElement) {
                            continue;
                        }
                        const type = listElement.getAttribute("type");
                        if (type) {
                            listElement.tagName = type;
                        }
                    }
                    for (const elementName of elementNames) {
                        const els = Array.from(dtBookDoc.getElementsByTagName(elementName)).filter((el) => el);
                        for (const el of els) {
                            el.setAttribute("data-dtbook", elementName);
                            const cls = el.getAttribute("class");
                            el.setAttribute("class", `${cls ? (cls + " ") : ""}${elementName}_R2`);
                            el.tagName =
                                ((elementName === "dtbook") ? "html" :
                                    ((elementName === "book") ? "body" :
                                        ((elementName === "pagenum") ? "span" :
                                            ((elementName === "sent") ? "span" :
                                                ((elementName === "caption") ? "figcaption" :
                                                    ((elementName === "imggroup") ? "figure" :
                                                        (elementName === "sidebar") ? "aside" :
                                                            "div"))))));
                            if (elementName === "pagenum") {
                                el.setAttribute("epub:type", "pagebreak");
                            }
                            else if (elementName === "annotation") {
                                el.setAttribute("epub:type", "annotation");
                            }
                            else if (elementName === "note") {
                                el.setAttribute("epub:type", "note");
                            }
                            else if (elementName === "prodnote") {
                                el.setAttribute("epub:type", "note");
                            }
                            else if (elementName === "sidebar") {
                                el.setAttribute("epub:type", "sidebar");
                            }
                        }
                    }
                    const stylesheets = select("/processing-instruction('xml-stylesheet')", dtBookDoc);
                    const cssHrefs = [];
                    for (const stylesheet of stylesheets) {
                        if (!stylesheet.nodeValue) {
                            continue;
                        }
                        if (!stylesheet.nodeValue.includes("text/css")) {
                            continue;
                        }
                        const match = stylesheet.nodeValue.match(/href=("|')(.*?)("|')/);
                        if (!match) {
                            continue;
                        }
                        const href = match[2].trim();
                        if (href) {
                            cssHrefs.push(href);
                        }
                    }
                    const smilRefs = select("//*[@smilref]", dtBookDoc);
                    for (const smilRef of smilRefs) {
                        const ref = smilRef.getAttribute("smilref");
                        if (ref) {
                            smilRef.setAttribute("data-smilref", ref);
                        }
                        smilRef.removeAttribute("smilref");
                    }
                    const dtbookNowXHTML = new xmldom.XMLSerializer().serializeToString(dtBookDoc)
                        .replace(/xmlns="http:\/\/www\.daisy\.org\/z3986\/2005\/dtbook\/"/, "xmlns=\"http://www.w3.org/1999/xhtml\"")
                        .replace(/xmlns="http:\/\/www\.daisy\.org\/z3986\/2005\/dtbook\/"/g, " ")
                        .replace(/^([\s\S]*)<html/gm, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html `)
                        .replace(/<head([\s\S]*?)>/gm, `
<head$1>
<meta charset="UTF-8" />
${title ? `<title>${title}</title>` : ""}
`)
                        .replace(/<\/head[\s\S]*?>/gm, `
${cssHrefs.reduce((pv, cv) => {
                        return pv + "\n" + `<link rel="stylesheet" type="text/css" href="${cv}" />`;
                    }, "")}
</head>
`);
                    const xhtmlFilePath = resLink.HrefDecoded.replace(/\.(.+)$/, ".xhtml");
                    zipfile.addBuffer(Buffer.from(dtbookNowXHTML), xhtmlFilePath);
                    const resLinkJson = serializable_1.TaJsonSerialize(resLink);
                    const resLinkClone = serializable_1.TaJsonDeserialize(resLinkJson, publication_link_1.Link);
                    resLinkClone.setHrefDecoded(xhtmlFilePath);
                    resLinkClone.TypeLink = "application/xhtml+xml";
                    dtBooks.push(resLinkClone);
                }
                else if (!resLink.HrefDecoded.endsWith(".opf") &&
                    !resLink.HrefDecoded.endsWith(".res") &&
                    !resLink.HrefDecoded.endsWith(".ncx")) {
                    const buff = await epub_daisy_common_1.loadFileBufferFromZipPath(resLink.Href, resLink.HrefDecoded, zip);
                    if (buff) {
                        zipfile.addBuffer(buff, resLink.HrefDecoded);
                    }
                    resourcesToKeep.push(resLink);
                }
            }
            if (mediaOverlaysMap) {
                Object.keys(mediaOverlaysMap).forEach((smilTextRef) => {
                    if (!mediaOverlaysMap) {
                        return;
                    }
                    debug("smilTextRef: " + smilTextRef);
                    const mos = mediaOverlaysMap[smilTextRef].mos;
                    if (mos.length === 1) {
                        debug("smilTextRef [1]: " + smilTextRef);
                        return;
                    }
                    const mergedMediaOverlays = new media_overlay_1.MediaOverlayNode();
                    mergedMediaOverlays.SmilPathInZip = undefined;
                    mergedMediaOverlays.initialized = true;
                    mergedMediaOverlays.Role = [];
                    mergedMediaOverlays.Role.push("section");
                    mergedMediaOverlays.duration = 0;
                    let i = -1;
                    for (const mo of mos) {
                        i++;
                        if (mo.Children) {
                            debug(`smilTextRef [${i}]: ` + smilTextRef);
                            if (!mergedMediaOverlays.Children) {
                                mergedMediaOverlays.Children = [];
                            }
                            mergedMediaOverlays.Children = mergedMediaOverlays.Children.concat(mo.Children);
                            if (mo.duration) {
                                mergedMediaOverlays.duration += mo.duration;
                            }
                        }
                    }
                    mediaOverlaysMap[smilTextRef].mos = [mergedMediaOverlays];
                });
                const mediaOverlaysSequence = Object.keys(mediaOverlaysMap).map((smilTextRef) => {
                    if (!mediaOverlaysMap) {
                        return undefined;
                    }
                    return {
                        index: mediaOverlaysMap[smilTextRef].index,
                        mo: mediaOverlaysMap[smilTextRef].mos[0],
                        smilTextRef,
                    };
                }).filter((e) => e).sort((a, b) => {
                    if (a && b && a.index < b.index) {
                        return -1;
                    }
                    if (a && b && a.index > b.index) {
                        return 1;
                    }
                    return 0;
                });
                for (const mediaOverlay of mediaOverlaysSequence) {
                    if (!mediaOverlay) {
                        continue;
                    }
                    debug("mediaOverlay:", mediaOverlay.index, mediaOverlay.smilTextRef);
                    const dtBookLink = dtBooks.find((l) => {
                        return l.HrefDecoded === mediaOverlay.smilTextRef;
                    });
                    if (!dtBookLink) {
                        debug("!!dtBookLink");
                    }
                    else if (dtBookLink.HrefDecoded !== mediaOverlay.smilTextRef) {
                        debug("dtBook.HrefDecoded !== mediaOverlay.smilTextRef", dtBookLink.HrefDecoded, mediaOverlay.smilTextRef);
                    }
                    else {
                        if (isFullTextAudio || isAudioOnly) {
                            dtBookLink.MediaOverlays = mediaOverlay.mo;
                            if (mediaOverlay.mo.duration) {
                                dtBookLink.Duration = mediaOverlay.mo.duration;
                            }
                            const moURL = `smil-media-overlays_${mediaOverlay.index}.json`;
                            if (!dtBookLink.Properties) {
                                dtBookLink.Properties = new metadata_properties_1.Properties();
                            }
                            dtBookLink.Properties.MediaOverlay = moURL;
                            if (!dtBookLink.Alternate) {
                                dtBookLink.Alternate = [];
                            }
                            const moLink = new publication_link_1.Link();
                            moLink.Href = moURL;
                            moLink.TypeLink = "application/vnd.syncnarr+json";
                            moLink.Duration = dtBookLink.Duration;
                            dtBookLink.Alternate.push(moLink);
                            const jsonObjMO = serializable_1.TaJsonSerialize(mediaOverlay.mo);
                            const jsonStrMO = global.JSON.stringify(jsonObjMO, null, "  ");
                            zipfile.addBuffer(Buffer.from(jsonStrMO), moURL);
                            debug("dtBookLink IN SPINE:", mediaOverlay.index, dtBookLink.HrefDecoded, dtBookLink.Duration, moURL);
                        }
                        else {
                            debug("dtBookLink IN SPINE (no audio):", mediaOverlay.index, dtBookLink.HrefDecoded);
                        }
                        publication.Spine.push(dtBookLink);
                    }
                }
            }
            publication.Resources = resourcesToKeep;
            if (!publication.Metadata) {
                publication.Metadata = new metadata_1.Metadata();
            }
            if (!publication.Metadata.AdditionalJSON) {
                publication.Metadata.AdditionalJSON = {};
            }
            publication.Metadata.AdditionalJSON.ReadiumWebPublicationConvertedFrom =
                isAudioOnly ? "DAISY_audioNCX" : (isTextOnly ? "DAISY_textNCX" : "DAISY_audioFullText");
            const findFirstDescendantText = (parent) => {
                if (parent.childNodes && parent.childNodes.length) {
                    for (let i = 0; i < parent.childNodes.length; i++) {
                        const child = parent.childNodes[i];
                        if (child.nodeType === 1) {
                            const element = child;
                            if (element.localName && element.localName.toLowerCase() === "text") {
                                return element;
                            }
                        }
                    }
                    for (let i = 0; i < parent.childNodes.length; i++) {
                        const child = parent.childNodes[i];
                        if (child.nodeType === 1) {
                            const element = child;
                            const found = findFirstDescendantText(element);
                            if (found) {
                                return found;
                            }
                        }
                    }
                }
                return undefined;
            };
            const processLink = async (link) => {
                let href = link.HrefDecoded;
                if (!href) {
                    return;
                }
                if (isAudioOnly) {
                    link.setHrefDecoded(href.replace(/\.smil/, ".xhtml"));
                    return;
                }
                let fragment;
                if (href.indexOf("#") >= 0) {
                    const arr = href.split("#");
                    href = arr[0].trim();
                    fragment = arr[1].trim();
                }
                if (!href) {
                    return;
                }
                let smilDoc = smilDocs[href];
                if (!smilDoc) {
                    const smilStr = await epub_daisy_common_1.loadFileStrFromZipPath(href, href, zip);
                    if (!smilStr) {
                        debug("!loadFileStrFromZipPath", smilStr);
                        return;
                    }
                    smilDoc = new xmldom.DOMParser().parseFromString(smilStr, "application/xml");
                    smilDocs[href] = smilDoc;
                }
                let targetEl = fragment ? smilDoc.getElementById(fragment) : undefined;
                if (!targetEl) {
                    targetEl = findFirstDescendantText(smilDoc.documentElement);
                }
                if (!targetEl) {
                    return;
                }
                if (targetEl.nodeName !== "text") {
                    targetEl = findFirstDescendantText(targetEl);
                }
                if (!targetEl || targetEl.nodeName !== "text") {
                    return;
                }
                const src = targetEl.getAttribute("src");
                if (!src) {
                    return;
                }
                link.Href = src.replace(/\.xml/, ".xhtml");
            };
            const processLinks = async (links) => {
                for (const link of links) {
                    await processLink(link);
                    if (link.Children) {
                        await processLinks(link.Children);
                    }
                }
            };
            if (publication.PageList) {
                for (const link of publication.PageList) {
                    await processLink(link);
                }
            }
            if (publication.Landmarks) {
                for (const link of publication.Landmarks) {
                    await processLink(link);
                }
            }
            if (publication.TOC) {
                await processLinks(publication.TOC);
            }
            const jsonObj = serializable_1.TaJsonSerialize(publication);
            const jsonStr = global.JSON.stringify(jsonObj, null, "  ");
            zipfile.addBuffer(Buffer.from(jsonStr), "manifest.json");
        }
        catch (erreur) {
            debug(erreur);
        }
        finally {
            timeoutId = setTimeout(() => {
                timeoutId = undefined;
                reject("YAZL zip took too long!? " + outputZipPath);
            }, 10000);
            zipfile.end();
        }
    });
};
exports.convertDaisyToReadiumWebPub = convertDaisyToReadiumWebPub;
//# sourceMappingURL=daisy-convert-to-epub.js.map