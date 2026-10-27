var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CostPlugin: () => CostPlugin
});
module.exports = __toCommonJS(index_exports);

// src/components/App.tsx
var import_react7 = __toESM(require("react"));

// src/components/CostOnly.tsx
var import_react3 = __toESM(require("react"));

// src/components/NumberOrInf.tsx
var import_react = __toESM(require("react"));
function NumberOrInf(props) {
  if (props.num >= 2147483647) {
    return /* @__PURE__ */ import_react.default.createElement("span", null, "\u221E ");
  }
  if (props.num % 1 != 0) {
    return /* @__PURE__ */ import_react.default.createElement("span", null, props.num.toFixed(2), " ");
  }
  return /* @__PURE__ */ import_react.default.createElement("span", null, props.num.toString(), " ");
}

// src/components/DetailsPopover.tsx
var import_react2 = __toESM(require("react"));
function DetailsPopover(props) {
  const [hover, setHover] = import_react2.default.useState(false);
  if (!Array.isArray(props.details) || props.details.length === 0) {
    return null;
  }
  const details = /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement(
    "h3",
    {
      style: {
        marginBlockStart: 0,
        marginBlockEnd: 0
      }
    },
    props.title
  ), /* @__PURE__ */ import_react2.default.createElement("ul", { style: {
    marginBlockStart: 5,
    marginBlockEnd: 5
  } }, props.details.map((ex, i) => {
    return /* @__PURE__ */ import_react2.default.createElement("li", { key: i }, ex);
  })));
  return /* @__PURE__ */ import_react2.default.createElement(
    "span",
    {
      style: {
        marginLeft: "0.2rem",
        color: "gray",
        borderBottom: "1px dotted gray",
        cursor: "pointer",
        position: "relative"
      },
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false)
    },
    "\u2139",
    /* @__PURE__ */ import_react2.default.createElement("div", { style: {
      display: hover ? "block" : "none",
      zIndex: 1e3,
      position: "absolute",
      borderRadius: "5px",
      backgroundColor: "#111",
      color: "white",
      bottom: 15,
      width: "max-content",
      padding: 5,
      right: -50
    } }, details)
  );
}

// src/components/CostOnly.tsx
function CostOnly({ characteristics }) {
  const typeCountDetails = characteristics.typeCounts && Object.keys(characteristics.typeCounts).map((key) => {
    return /* @__PURE__ */ import_react3.default.createElement("span", null, key, ": ", /* @__PURE__ */ import_react3.default.createElement(NumberOrInf, { num: characteristics.typeCounts[key] }));
  }) || null;
  const fieldCountDetails = characteristics.fieldCounts && Object.keys(characteristics.fieldCounts).map((key) => {
    return /* @__PURE__ */ import_react3.default.createElement("span", null, key, ": ", /* @__PURE__ */ import_react3.default.createElement(NumberOrInf, { num: characteristics.fieldCounts[key] }));
  }) || null;
  return /* @__PURE__ */ import_react3.default.createElement("div", { style: { padding: "0.5em 0 0.5em 0.5em" } }, /* @__PURE__ */ import_react3.default.createElement(
    "h3",
    {
      style: {
        marginBlockStart: "0.2em",
        marginBlockEnd: 0
      }
    },
    "Query cost"
  ), /* @__PURE__ */ import_react3.default.createElement("div", { style: { paddingLeft: "0.5em" } }, "Type cost: ", /* @__PURE__ */ import_react3.default.createElement(NumberOrInf, { num: characteristics.typeCost }), /* @__PURE__ */ import_react3.default.createElement(DetailsPopover, { title: "Type counts", details: typeCountDetails }), " "), /* @__PURE__ */ import_react3.default.createElement("div", { style: { paddingLeft: "0.5em" } }, "Field cost: ", /* @__PURE__ */ import_react3.default.createElement(NumberOrInf, { num: characteristics.fieldCost }), /* @__PURE__ */ import_react3.default.createElement(DetailsPopover, { title: "Field counts", details: fieldCountDetails }), " "));
}

// src/components/CostAndRates.tsx
var import_react6 = __toESM(require("react"));

// src/components/TimeFrameDetails.tsx
var import_react4 = __toESM(require("react"));
function getAllowedTimes(rate, cost) {
  if (rate === 0 || cost === 0) {
    return Number.MAX_SAFE_INTEGER;
  }
  return Math.floor(rate / cost);
}
function TimeFrameDetails({ timeFrame, limits, characteristics }) {
  const typeLimit = limits.find(
    (val) => val.name === "typeCost"
  );
  const fieldLimit = limits.find(
    (val) => val.name === "fieldCost"
  );
  const typeCountDetails = characteristics.typeCounts && Object.keys(characteristics.typeCounts).map((key) => {
    return /* @__PURE__ */ import_react4.default.createElement("span", null, key, ": ", /* @__PURE__ */ import_react4.default.createElement(NumberOrInf, { num: characteristics.typeCounts[key] }));
  }) || null;
  const fieldCountDetails = characteristics.fieldCounts && Object.keys(characteristics.fieldCounts).map((key) => {
    return /* @__PURE__ */ import_react4.default.createElement("span", null, key, ": ", /* @__PURE__ */ import_react4.default.createElement(NumberOrInf, { num: characteristics.fieldCounts[key] }));
  }) || null;
  return /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("h4", { style: { marginBlockStart: "0.3em", marginBlockEnd: 0 } }, "Limits for ", timeFrame.interval, " ", timeFrame.unit, ":"), /* @__PURE__ */ import_react4.default.createElement("div", null, typeLimit ? /* @__PURE__ */ import_react4.default.createElement("span", { style: { paddingLeft: "0.5em" } }, /* @__PURE__ */ import_react4.default.createElement(NumberOrInf, { num: getAllowedTimes(typeLimit.rate, characteristics.typeCost) }), "times for type cost of ", /* @__PURE__ */ import_react4.default.createElement(NumberOrInf, { num: characteristics.typeCost }), /* @__PURE__ */ import_react4.default.createElement(DetailsPopover, { title: "Type counts", details: typeCountDetails })) : /* @__PURE__ */ import_react4.default.createElement("span", { style: { color: "gray", paddingLeft: "0.5em" } }, "No limit defined for type cost")), /* @__PURE__ */ import_react4.default.createElement("div", null, fieldLimit ? /* @__PURE__ */ import_react4.default.createElement("span", { style: { paddingLeft: "0.5em" } }, /* @__PURE__ */ import_react4.default.createElement(NumberOrInf, { num: getAllowedTimes(fieldLimit.rate, characteristics.fieldCost) }), "times for field cost of ", /* @__PURE__ */ import_react4.default.createElement(NumberOrInf, { num: characteristics.fieldCost }), /* @__PURE__ */ import_react4.default.createElement(DetailsPopover, { title: "Field counts", details: fieldCountDetails })) : /* @__PURE__ */ import_react4.default.createElement("span", { style: { color: "gray", paddingLeft: "0.5em" } }, "No limit defined for field cost")));
}

// src/components/Triangle.tsx
var import_react5 = __toESM(require("react"));
function Triangle() {
  return /* @__PURE__ */ import_react5.default.createElement("div", { style: {
    width: 0,
    height: 0,
    borderTop: "8px solid transparent",
    borderBottom: "8px solid transparent",
    borderRight: "8px solid #444",
    float: "right"
  } });
}

// src/components/CostAndRates.tsx
function groupByTimeFrames(limits, timeFrames, limitName) {
  if (!Array.isArray(limits) || limits.length === 0) return;
  limits.forEach((limit) => {
    const frame = timeFrames.find((e) => e.timeFrame.interval === limit.interval && e.timeFrame.unit === limit.unit);
    if (frame) {
      frame.limits.push({ name: limitName, rate: limit.rate });
    } else {
      timeFrames.push({
        timeFrame: { interval: limit.interval, unit: limit.unit },
        limits: [{ name: limitName, rate: limit.rate }]
      });
    }
  });
}
function getMaxAllowed(limits, characteristics) {
  let maxAllowed = Number.MAX_SAFE_INTEGER;
  limits.forEach(({ name, rate }) => {
    const cost = characteristics[name];
    const allowed = typeof cost === "number" && cost !== 0 && rate !== 0 ? Math.floor(rate / cost) : Number.MAX_SAFE_INTEGER;
    if (allowed < maxAllowed) maxAllowed = allowed;
  });
  return maxAllowed;
}
function CostAndRates({ characteristics, rateLimits }) {
  const [inFocus, setInFocus] = (0, import_react6.useState)(null);
  const fieldCostLimits = rateLimits.assemblyRateLimits?.["graphql-field-cost"];
  const typeCostLimits = rateLimits.assemblyRateLimits?.["graphql-type-cost"];
  const inputTypeCostLimits = rateLimits.assemblyRateLimits?.["graphql-type-cost"];
  const timeFrames = [];
  groupByTimeFrames(fieldCostLimits, timeFrames, "fieldCost");
  groupByTimeFrames(typeCostLimits, timeFrames, "typeCost");
  groupByTimeFrames(inputTypeCostLimits, timeFrames, "inputTypeCost");
  function handleClick(newInFocus) {
    if (inFocus && inFocus.timeFrame.interval === newInFocus.timeFrame.interval && inFocus.timeFrame.unit === newInFocus.timeFrame.unit) {
      setInFocus(null);
    } else {
      setInFocus(newInFocus);
    }
  }
  let details = inFocus ? /* @__PURE__ */ import_react6.default.createElement(
    TimeFrameDetails,
    {
      timeFrame: inFocus.timeFrame,
      characteristics,
      limits: inFocus.limits
    }
  ) : null;
  const main = /* @__PURE__ */ import_react6.default.createElement("div", null, /* @__PURE__ */ import_react6.default.createElement("h3", { style: {
    marginBlockStart: "0.2em",
    marginBlockEnd: 0
  } }, "Query limits:"), timeFrames.map((entry, key) => {
    const maxAllowed = getMaxAllowed(entry.limits, characteristics);
    const linkActive = inFocus ? entry.timeFrame.interval === inFocus.timeFrame.interval && entry.timeFrame.unit === inFocus.timeFrame.unit : false;
    const link = /* @__PURE__ */ import_react6.default.createElement(
      "span",
      {
        onClick: () => handleClick(entry),
        style: {
          fontStyle: "italic",
          textDecorationStyle: "dotted",
          cursor: "pointer",
          paddingLeft: 10
        }
      },
      linkActive ? "hide..." : "more..."
    );
    return /* @__PURE__ */ import_react6.default.createElement("div", { key, style: { paddingLeft: "0.5em" } }, /* @__PURE__ */ import_react6.default.createElement(NumberOrInf, { num: maxAllowed }), "times per ", entry.timeFrame.interval, " ", entry.timeFrame.unit, link, linkActive ? /* @__PURE__ */ import_react6.default.createElement(Triangle, null) : null);
  }));
  let overall = details ? /* @__PURE__ */ import_react6.default.createElement(import_react6.default.Fragment, null, /* @__PURE__ */ import_react6.default.createElement("div", { style: { width: 250, padding: "0.5em 0 0.5em 0.5em" } }, main), /* @__PURE__ */ import_react6.default.createElement("div", { style: { flex: 1, backgroundColor: "#444", color: "white", padding: "0.5em 0 0.5em 0.5em" } }, details)) : /* @__PURE__ */ import_react6.default.createElement(import_react6.default.Fragment, null, /* @__PURE__ */ import_react6.default.createElement("div", { style: { flex: 1, padding: "0.5em 0 0.5em 0.5em" } }, main));
  return /* @__PURE__ */ import_react6.default.createElement("div", { style: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%"
  } }, overall);
}

// src/components/App.tsx
function CostPlugin({ dataAvailability, costData }) {
  let main;
  switch (dataAvailability) {
    case "NONE" /* None */:
      main = /* @__PURE__ */ import_react7.default.createElement("h3", { style: { color: "#cdcdcd", textAlign: "center" } }, "No data yet");
      break;
    case "LOADING" /* Loading */:
      main = /* @__PURE__ */ import_react7.default.createElement("h3", { style: { color: "#cdcdcd", textAlign: "center" } }, "Loading...");
      break;
    case "ERROR" /* Error */:
      let errMsg = "Error loading cost data";
      if (typeof costData === "object" && costData && costData.errors) {
        const errs = Array.isArray(costData.errors) ? costData.errors : [costData.errors];
        errMsg = /* @__PURE__ */ import_react7.default.createElement("ul", null, errs.map((e) => {
          return /* @__PURE__ */ import_react7.default.createElement("li", null, e && e.message || "");
        }));
      }
      main = /* @__PURE__ */ import_react7.default.createElement("h3", { style: { color: "#cdcdcd", textAlign: "center" } }, errMsg);
      break;
    case "AVAILABLE" /* Available */:
      if (typeof costData === "object" && typeof costData.request === "object" && typeof costData.rateLimits === "object") {
        main = /* @__PURE__ */ import_react7.default.createElement(CostAndRates, { characteristics: costData.request, rateLimits: costData.rateLimits });
      } else if (typeof costData.request === "object") {
        main = /* @__PURE__ */ import_react7.default.createElement(CostOnly, { characteristics: costData.request });
      } else {
        main = /* @__PURE__ */ import_react7.default.createElement("h3", { style: { color: "#cdcdcd", textAlign: "center" } }, "Error rendering cost data");
      }
      break;
  }
  return /* @__PURE__ */ import_react7.default.createElement("div", { className: "qcs_wrapper" }, main);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CostPlugin
});
