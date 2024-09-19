'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const fluidUtilities = {
  "f-text": "font-size",
  "f-w": "width",
  "f-min-w": "min-width",
  "f-max-w": "max-width",
  "f-h": "height",
  "f-min-h": "min-height",
  "f-max-h": "max-height",
  "f-p": "padding",
  "f-pt": "padding-top",
  "f-pb": "padding-bottom",
  "f-pl": "padding-left",
  "f-pr": "padding-right",
  "f-px": ["padding-left", "padding-right"],
  "f-py": ["padding-top", "padding-bottom"],
  "f-m": "margin",
  "f-mt": "margin-top",
  "f-mb": "margin-bottom",
  "f-ml": "margin-left",
  "f-mr": "margin-right",
  "f-mx": ["margin-left", "margin-right"],
  "f-my": ["margin-top", "margin-bottom"],
  "f-gap": "gap",
  "f-gap-x": "column-gap",
  "f-gap-y": "row-gap",
  "f-indent": "text-indent",
  "f-scroll-m": "scroll-margin",
  "f-scroll-mt": "scroll-margin-top",
  "f-scroll-mb": "scroll-margin-bottom",
  "f-scroll-ml": "scroll-margin-left",
  "f-scroll-mr": "scroll-margin-right",
  "f-scroll-mx": ["scroll-margin-left", "scroll-margin-right"],
  "f-scroll-my": ["scroll-margin-top", "scroll-margin-bottom"],
  "f-scroll-ms": "scroll-margin-inline-start",
  "f-scroll-me": "scroll-margin-inline-end",
  "f-scroll-p": "scroll-padding",
  "f-scroll-pt": "scroll-padding-top",
  "f-scroll-pb": "scroll-padding-bottom",
  "f-scroll-pl": "scroll-padding-left",
  "f-scroll-pr": "scroll-padding-right",
  "f-scroll-px": ["scroll-padding-left", "scroll-padding-right"],
  "f-scroll-py": ["scroll-padding-top", "scroll-padding-bottom"],
  "f-scroll-ps": "scroll-padding-inline-start",
  "f-scroll-pe": "scroll-padding-inline-end",
  "f-leading": "line-height",
  "f-top": "top",
  "f-right": "right",
  "f-bottom": "bottom",
  "f-left": "left",
  "f-inset": "inset",
  "f-inset-x": ["left", "right"],
  "f-inset-y": ["top", "bottom"]
};

const REGEX_PATTERNS_NUMERIC_VALUES = "(?:--)?(-?\\d+)?(?:--)?(-?\\d+)?$";
const REGEX_PATTERNS_RANGE_VALUES = "(?:--)?(-?\\d+)?(?:-([a-zA-Z0-9]+))?$";
function extractValuesFromRegexMatch(match) {
  const [utility, matchMin, matchMax, , predefinedRangeName] = match;
  return {
    utility,
    matchMin,
    matchMax,
    predefinedRangeName
  };
}

function validateUtilityRange(range, utility, config) {
  if (!config.ranges)
    throw new Error(`[unocss-preset-fluid] (${utility}) Trying to use predefined range ${range} but no ranges are defined.`);
  if (!config.ranges[range])
    throw new Error(`[unocss-preset-fluid] (${utility}) Trying to use predefined range ${range} but it is not defined in ranges.`);
  return true;
}
function validateUtilityName(match, config) {
  const { utility, matchMin, matchMax, predefinedRangeName } = extractValuesFromRegexMatch(match);
  if (!predefinedRangeName && matchMin && matchMax)
    return true;
  try {
    validateUtilityRange(predefinedRangeName, utility, config);
  } catch (error) {
    console.warn(error.message);
    return false;
  }
  return true;
}

function invertAndParseNumber(value) {
  if (!value)
    return 0;
  if (value.includes("-"))
    return Number.parseInt(value.replace("-", ""));
  return -Number.parseInt(value);
}

function getRemMaxWidth(config) {
  const maxWidth = config.extendMaxWidth || config.maxWidth;
  if (config.useRemByDefault)
    return maxWidth;
  else
    return maxWidth / config.remBase;
}
function getRemMinWidth(config) {
  const minWidth = config.extendMinWidth || config.minWidth;
  if (config.useRemByDefault)
    return minWidth;
  else
    return minWidth / config.remBase;
}
function toRem(value, config) {
  if (config.useRemByDefault)
    return value;
  else
    return value / config.remBase;
}
function calculateRelativeSize(originalViewPortMin, originalMinSize, originalMaxSize, originalViewPortMax, newViewPortSize) {
  const slope = (originalMaxSize - originalMinSize) / (originalViewPortMax - originalViewPortMin);
  return slope * (newViewPortSize - originalViewPortMin) + originalMinSize;
}
function extractRemBoundsFromMatch(match, config) {
  let min, max;
  const [utility, matchMin, matchMax, , predefinedRangeName] = match;
  if (predefinedRangeName) {
    validateUtilityRange(predefinedRangeName, utility, config);
    min = toRem(config.ranges[predefinedRangeName][0], config);
    max = toRem(config.ranges[predefinedRangeName][1], config);
  } else {
    min = toRem(invertAndParseNumber(matchMin), config);
    max = toRem(invertAndParseNumber(matchMax), config);
  }
  let relativeMin;
  let relativeMax;
  if (config.extendMinWidth)
    relativeMin = calculateRelativeSize(config.minWidth, min, max, config.maxWidth, config.extendMinWidth);
  if (config.extendMaxWidth)
    relativeMax = calculateRelativeSize(config.minWidth, min, max, config.maxWidth, config.extendMaxWidth);
  return {
    min: relativeMin ?? min,
    max: relativeMax ?? max
  };
}

function getSlope(min, max, config) {
  const remMaxWidth = getRemMaxWidth(config);
  const remMinWidth = getRemMinWidth(config);
  return (max - min) / (remMaxWidth - remMinWidth);
}
function getIntersection(min, slope, minWidth) {
  return -minWidth * slope + min;
}
function getSlopePercentage(min, max, config) {
  const slope = getSlope(min, max, config);
  return slope * 100;
}
function getClamp(min, max, config) {
  const slope = getSlope(min, max, config);
  const intersection = getIntersection(min, slope, getRemMinWidth(config));
  const slopePercentage = getSlopePercentage(min, max, config);
  const clampMin = Math.min(min, max);
  const clampMax = Math.max(min, max);
  return `clamp(${clampMin}rem, ${intersection.toFixed(4)}rem + ${slopePercentage.toFixed(4)}vw, ${clampMax}rem)`;
}
function getClampComment(match, config) {
  if (!config.commentHelpers)
    return "";
  const { predefinedRangeName, matchMin, matchMax } = extractValuesFromRegexMatch(match);
  const predefinedRange = config.ranges && config.ranges[predefinedRangeName];
  const isRem = config.useRemByDefault;
  const min = predefinedRange ? predefinedRange[0] : -Number.parseInt(matchMin);
  const max = predefinedRange ? predefinedRange[1] : -Number.parseInt(matchMax);
  const unit = isRem ? "rem" : "px";
  return `/* ${min}${unit} -> ${max}${unit} */`;
}

function buildSinglePropertyRule(match, config, property) {
  if (!validateUtilityName(match, config))
    return "";
  const { min, max } = extractRemBoundsFromMatch(match, config);
  return {
    [`${property}`]: getClamp(min, max, config) + getClampComment(match, config)
  };
}
function buildMultiplePropertiesRule(match, config, properties) {
  if (!validateUtilityName(match, config) || !Array.isArray(properties))
    return "";
  const { min, max } = extractRemBoundsFromMatch(match, config);
  const selectors = {};
  properties.forEach((property) => {
    selectors[property] = getClamp(min, max, config) + getClampComment(match, config);
  });
  return {
    ...selectors
  };
}
function buildRule(name, properties, config) {
  const regexPattersNumericValues = `^${name}${REGEX_PATTERNS_NUMERIC_VALUES}`;
  const regexPattersRangeValues = `^${name}${REGEX_PATTERNS_RANGE_VALUES}`;
  const regexPattern = `${regexPattersNumericValues}|${regexPattersRangeValues}`;
  const regex = new RegExp(regexPattern);
  if (Array.isArray(properties)) {
    return [
      [
        regex,
        (match) => buildMultiplePropertiesRule(match, config, properties)
      ]
    ];
  } else {
    return [
      [
        regex,
        (match) => buildSinglePropertyRule(match, config, properties)
      ]
    ];
  }
}
function buildRulesFromUtilities(config) {
  return Object.entries(fluidUtilities).flatMap(([name, property]) => {
    return buildRule(name, property, config);
  });
}

const defaultOptions = {
  maxWidth: 1440,
  minWidth: 375,
  remBase: 16,
  useRemByDefault: false,
  extendMaxWidth: null,
  extendMinWidth: null,
  ranges: null,
  commentHelpers: false
};
function presetFluid(options) {
  const config = Object.assign({}, defaultOptions, options);
  return {
    name: "unocss-preset-fluid",
    rules: [
      ...buildRulesFromUtilities(config)
    ]
  };
}

exports.defaultOptions = defaultOptions;
exports.presetFluid = presetFluid;
