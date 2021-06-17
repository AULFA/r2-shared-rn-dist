"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var path = require("path");
var metadata_belongsto_1 = require("../src/models/metadata-belongsto");
var metadata_contributor_1 = require("../src/models/metadata-contributor");
var lcp_1 = require("r2-lcp-rn/dist/es5/src/parser/epub/lcp");
var serializable_1 = require("r2-lcp-rn/dist/es5/src/serializable");
var init_globals_1 = require("../src/init-globals");
var helpers_1 = require("./helpers");
init_globals_1.initGlobalConverters_SHARED();
init_globals_1.initGlobalConverters_GENERIC();
lcp_1.setLcpNativePluginPath(path.join(process.cwd(), "LCP", "lcp.node"));
var contributor1NameStr = "theName1";
var contributor1Id = "theID1";
var contributor1Pos = 1;
var contributor1 = new metadata_contributor_1.Contributor();
contributor1.Name = contributor1NameStr;
contributor1.Identifier = contributor1Id;
contributor1.Position = contributor1Pos;
var contributor1RoleArr = ["theRole1-A", "theRole1-B"];
contributor1.Role = contributor1RoleArr;
var contributor2NameMapLang = "en";
var contributor2NameMapVal = "theName2";
var contributor2NameMap = {};
contributor2NameMap[contributor2NameMapLang] = contributor2NameMapVal;
var contributor2NameObj = { name: contributor2NameMap };
var contributor2Id = "theID2";
var contributor2 = new metadata_contributor_1.Contributor();
contributor2.Name = contributor2NameMap;
contributor2.Identifier = contributor2Id;
var contributor2RoleStr = "theRole2";
contributor2.Role = [contributor2RoleStr];
var checkContributor1Name = function (t, obj) {
    helpers_1.checkType_String(t, obj);
    t.is(obj, contributor1NameStr);
};
var checkContributor2Name = function (t, obj) {
    helpers_1.checkType_Object(t, obj);
    helpers_1.checkType_String(t, obj[contributor2NameMapLang]);
    t.is(obj[contributor2NameMapLang], contributor2NameMapVal);
};
var checkJsonContributor1 = function (t, obj) {
    helpers_1.checkType_Object(t, obj);
    checkContributor1Name(t, obj.name);
    helpers_1.checkType_String(t, obj.identifier);
    t.is(obj.identifier, contributor1Id);
    helpers_1.checkType_Number(t, obj.position);
    t.is(obj.position, contributor1Pos);
    helpers_1.checkType_Array(t, obj.role);
    t.is(obj.role.length, contributor1RoleArr.length);
    t.is(obj.role[0], contributor1RoleArr[0]);
    t.is(obj.role[1], contributor1RoleArr[1]);
};
var checkJsonContributor2 = function (t, obj) {
    helpers_1.checkType_Object(t, obj);
    checkContributor2Name(t, obj.name);
    helpers_1.checkType_String(t, obj.identifier);
    t.is(obj.identifier, contributor2Id);
    helpers_1.checkType_String(t, obj.role);
    t.is(obj.role, contributor2RoleStr);
};
var checkObjContributor1 = function (t, obj) {
    helpers_1.checkType(t, obj, metadata_contributor_1.Contributor);
    checkContributor1Name(t, obj.Name);
    helpers_1.checkType_String(t, obj.Identifier);
    t.is(obj.Identifier, contributor1Id);
    helpers_1.checkType_Number(t, obj.Position);
    t.is(obj.Position, contributor1Pos);
    helpers_1.checkType_Array(t, obj.Role);
    t.is(obj.Role.length, 2);
    t.is(obj.Role[0], contributor1RoleArr[0]);
    t.is(obj.Role[1], contributor1RoleArr[1]);
};
var checkObjContributor2 = function (t, obj) {
    helpers_1.checkType(t, obj, metadata_contributor_1.Contributor);
    checkContributor2Name(t, obj.Name);
    helpers_1.checkType_String(t, obj.Identifier);
    t.is(obj.Identifier, contributor2Id);
    helpers_1.checkType_Array(t, obj.Role);
    t.is(obj.Role.length, 1);
    t.is(obj.Role[0], contributor2RoleStr);
};
ava_1.default("JSON SERIALIZE: BelongsTo.Series => Contributor[]", function (t) {
    var b = new metadata_belongsto_1.BelongsTo();
    b.Series = [];
    b.Series.push(contributor1);
    b.Series.push(contributor2);
    helpers_1.inspect(b);
    var json = serializable_1.TaJsonSerialize(b);
    helpers_1.logJSON(json);
    helpers_1.checkType_Array(t, json.series);
    var arr = json.series;
    t.is(arr.length, 2);
    checkJsonContributor1(t, arr[0]);
    checkJsonContributor2(t, arr[1]);
});
ava_1.default("JSON SERIALIZE: BelongsTo.Series => Contributor[1] collapse-array", function (t) {
    var b = new metadata_belongsto_1.BelongsTo();
    b.Series = [contributor1];
    helpers_1.inspect(b);
    var json = serializable_1.TaJsonSerialize(b);
    helpers_1.logJSON(json);
    checkJsonContributor1(t, json.series);
});
ava_1.default("JSON DESERIALIZE: BelongsTo.Series => Contributor[]", function (t) {
    var json = {};
    json.series = [
        { name: contributor1NameStr, identifier: contributor1Id, position: contributor1Pos, role: contributor1RoleArr },
        { name: contributor2NameMap, identifier: contributor2Id, role: contributor2RoleStr },
    ];
    helpers_1.logJSON(json);
    var b = serializable_1.TaJsonDeserialize(json, metadata_belongsto_1.BelongsTo);
    helpers_1.inspect(b);
    helpers_1.checkType_Array(t, b.Series);
    t.is(b.Series.length, 2);
    checkObjContributor1(t, b.Series[0]);
    checkObjContributor2(t, b.Series[1]);
});
ava_1.default("JSON DESERIALIZE: BelongsTo.Series => Contributor[1]", function (t) {
    var json = {};
    json.series = [
        { name: contributor1NameStr, identifier: contributor1Id, position: contributor1Pos, role: contributor1RoleArr },
    ];
    helpers_1.logJSON(json);
    var b = serializable_1.TaJsonDeserialize(json, metadata_belongsto_1.BelongsTo);
    helpers_1.inspect(b);
    helpers_1.checkType_Array(t, b.Series);
    t.is(b.Series.length, 1);
    checkObjContributor1(t, b.Series[0]);
});
ava_1.default("JSON DESERIALIZE: BelongsTo.Series => Contributor", function (t) {
    var json = {};
    json.series = { name: contributor1NameStr, identifier: contributor1Id, position: contributor1Pos, role: contributor1RoleArr };
    helpers_1.logJSON(json);
    var b = serializable_1.TaJsonDeserialize(json, metadata_belongsto_1.BelongsTo);
    helpers_1.inspect(b);
    helpers_1.checkType_Array(t, b.Series);
    t.is(b.Series.length, 1);
    checkObjContributor1(t, b.Series[0]);
});
ava_1.default("JSON DESERIALIZE: BelongsTo.Series => Contributor NAME []", function (t) {
    var json = {};
    json.series = [contributor1NameStr, contributor2NameObj];
    helpers_1.logJSON(json);
    var b = serializable_1.TaJsonDeserialize(json, metadata_belongsto_1.BelongsTo);
    helpers_1.inspect(b);
    helpers_1.checkType_Array(t, b.Series);
    t.is(b.Series.length, 2);
    helpers_1.checkType(t, b.Series[0], metadata_contributor_1.Contributor);
    checkContributor1Name(t, b.Series[0].Name);
    helpers_1.checkType(t, b.Series[1], metadata_contributor_1.Contributor);
    checkContributor2Name(t, b.Series[1].Name);
});
ava_1.default("JSON DESERIALIZE: BelongsTo.Series => Contributor NAME [1] A", function (t) {
    var json = {};
    json.series = [contributor1NameStr];
    helpers_1.logJSON(json);
    var b = serializable_1.TaJsonDeserialize(json, metadata_belongsto_1.BelongsTo);
    helpers_1.inspect(b);
    helpers_1.checkType_Array(t, b.Series);
    t.is(b.Series.length, 1);
    helpers_1.checkType(t, b.Series[0], metadata_contributor_1.Contributor);
    checkContributor1Name(t, b.Series[0].Name);
});
ava_1.default("JSON DESERIALIZE: BelongsTo.Series => Contributor NAME [1] B", function (t) {
    var json = {};
    json.series = [contributor2NameObj];
    helpers_1.logJSON(json);
    var b = serializable_1.TaJsonDeserialize(json, metadata_belongsto_1.BelongsTo);
    helpers_1.inspect(b);
    helpers_1.checkType_Array(t, b.Series);
    t.is(b.Series.length, 1);
    helpers_1.checkType(t, b.Series[0], metadata_contributor_1.Contributor);
    checkContributor2Name(t, b.Series[0].Name);
});
ava_1.default("JSON DESERIALIZE: BelongsTo.Series => Contributor NAME A", function (t) {
    var json = {};
    json.series = contributor1NameStr;
    helpers_1.logJSON(json);
    var b = serializable_1.TaJsonDeserialize(json, metadata_belongsto_1.BelongsTo);
    helpers_1.inspect(b);
    helpers_1.checkType_Array(t, b.Series);
    t.is(b.Series.length, 1);
    helpers_1.checkType(t, b.Series[0], metadata_contributor_1.Contributor);
    checkContributor1Name(t, b.Series[0].Name);
});
ava_1.default("JSON DESERIALIZE: BelongsTo.Series => Contributor NAME B", function (t) {
    var json = {};
    json.series = contributor2NameObj;
    helpers_1.logJSON(json);
    var b = serializable_1.TaJsonDeserialize(json, metadata_belongsto_1.BelongsTo);
    helpers_1.inspect(b);
    helpers_1.checkType_Array(t, b.Series);
    t.is(b.Series.length, 1);
    helpers_1.checkType(t, b.Series[0], metadata_contributor_1.Contributor);
    checkContributor2Name(t, b.Series[0].Name);
});
//# sourceMappingURL=test-JSON-Collection.js.map