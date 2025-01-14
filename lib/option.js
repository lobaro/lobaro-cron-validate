"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOptions = exports.registerOptionPreset = exports.getOptionPresets = exports.getOptionPreset = void 0;
const yup = __importStar(require("yup"));
require("yup");
const result_1 = require("./result");
const presets_1 = __importDefault(require("./presets"));
require("./types");
const optionPresets = {
    // http://crontab.org/
    default: {
        presetId: 'default',
        useSeconds: false,
        useYears: false,
        useAliases: false,
        useBlankDay: false,
        allowOnlyOneBlankDayField: false,
        mustHaveBlankDayField: false,
        useLastDayOfMonth: false,
        useLastDayOfWeek: false,
        useNearestWeekday: false,
        lobaroUseListOfNearestWeekdays: false,
        lobaroUseHashValue: false,
        useNthWeekdayOfMonth: false,
        seconds: {
            minValue: 0,
            maxValue: 59,
        },
        minutes: {
            minValue: 0,
            maxValue: 59,
        },
        hours: {
            minValue: 0,
            maxValue: 23,
        },
        daysOfMonth: {
            minValue: 0,
            maxValue: 31,
        },
        months: {
            minValue: 0,
            maxValue: 12,
        },
        daysOfWeek: {
            minValue: 0,
            maxValue: 7,
        },
        years: {
            minValue: 1970,
            maxValue: 2099,
        },
    },
};
const optionPresetSchema = yup
    .object({
    presetId: yup.string().required(),
    useSeconds: yup.boolean().required(),
    useYears: yup.boolean().required(),
    useAliases: yup.boolean(),
    useBlankDay: yup.boolean().required(),
    allowOnlyOneBlankDayField: yup.boolean().required(),
    mustHaveBlankDayField: yup.boolean(),
    useLastDayOfMonth: yup.boolean(),
    useLastDayOfWeek: yup.boolean(),
    useNearestWeekday: yup.boolean(),
    lobaroUseListOfNearestWeekdays: yup.boolean(),
    lobaroUseHashValue: yup.boolean(),
    useNthWeekdayOfMonth: yup.boolean(),
    seconds: yup
        .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
    })
        .required(),
    minutes: yup
        .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
    })
        .required(),
    hours: yup
        .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
    })
        .required(),
    daysOfMonth: yup
        .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
    })
        .required(),
    months: yup
        .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
    })
        .required(),
    daysOfWeek: yup
        .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
    })
        .required(),
    years: yup
        .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
    })
        .required(),
})
    .required();
const getOptionPreset = (presetId) => {
    if (optionPresets[presetId]) {
        return result_1.valid(optionPresets[presetId]);
    }
    return result_1.err(`Option preset '${presetId}' not found.`);
};
exports.getOptionPreset = getOptionPreset;
const getOptionPresets = () => optionPresets;
exports.getOptionPresets = getOptionPresets;
const registerOptionPreset = (presetName, preset) => {
    optionPresets[presetName] = optionPresetSchema.validateSync(preset, {
        strict: false,
        abortEarly: false,
        stripUnknown: true,
        recursive: true,
    });
};
exports.registerOptionPreset = registerOptionPreset;
const validateOptions = (inputOptions) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    try {
        // load default presets
        presets_1.default();
        let preset;
        if (inputOptions.preset) {
            if (typeof inputOptions.preset === 'string') {
                if (!optionPresets[inputOptions.preset]) {
                    return result_1.err([`Option preset ${inputOptions.preset} does not exist.`]);
                }
                preset = optionPresets[inputOptions.preset];
            }
            else {
                preset = inputOptions.preset;
            }
        }
        else {
            preset = optionPresets.default;
        }
        const unvalidatedConfig = Object.assign(Object.assign({ presetId: preset.presetId, preset }, {
            useSeconds: preset.useSeconds,
            useYears: preset.useYears,
            useAliases: (_a = preset.useAliases) !== null && _a !== void 0 ? _a : false,
            useBlankDay: preset.useBlankDay,
            allowOnlyOneBlankDayField: preset.allowOnlyOneBlankDayField,
            mustHaveBlankDayField: (_b = preset.mustHaveBlankDayField) !== null && _b !== void 0 ? _b : false,
            useLastDayOfMonth: (_c = preset.useLastDayOfMonth) !== null && _c !== void 0 ? _c : false,
            useLastDayOfWeek: (_d = preset.useLastDayOfWeek) !== null && _d !== void 0 ? _d : false,
            useNearestWeekday: (_e = preset.useNearestWeekday) !== null && _e !== void 0 ? _e : false,
            lobaroUseListOfNearestWeekdays: (_f = preset.lobaroUseListOfNearestWeekdays) !== null && _f !== void 0 ? _f : false,
            lobaroUseHashValue: (_g = preset.lobaroUseHashValue) !== null && _g !== void 0 ? _g : false,
            useNthWeekdayOfMonth: (_h = preset.useNthWeekdayOfMonth) !== null && _h !== void 0 ? _h : false,
            seconds: {
                lowerLimit: (_j = preset.seconds.lowerLimit) !== null && _j !== void 0 ? _j : preset.seconds.minValue,
                upperLimit: (_k = preset.seconds.upperLimit) !== null && _k !== void 0 ? _k : preset.seconds.maxValue,
            },
            minutes: {
                lowerLimit: (_l = preset.minutes.lowerLimit) !== null && _l !== void 0 ? _l : preset.minutes.minValue,
                upperLimit: (_m = preset.minutes.upperLimit) !== null && _m !== void 0 ? _m : preset.minutes.maxValue,
            },
            hours: {
                lowerLimit: (_o = preset.hours.lowerLimit) !== null && _o !== void 0 ? _o : preset.hours.minValue,
                upperLimit: (_p = preset.hours.upperLimit) !== null && _p !== void 0 ? _p : preset.hours.maxValue,
            },
            daysOfMonth: {
                lowerLimit: (_q = preset.daysOfMonth.lowerLimit) !== null && _q !== void 0 ? _q : preset.daysOfMonth.minValue,
                upperLimit: (_r = preset.daysOfMonth.upperLimit) !== null && _r !== void 0 ? _r : preset.daysOfMonth.maxValue,
            },
            months: {
                lowerLimit: (_s = preset.months.lowerLimit) !== null && _s !== void 0 ? _s : preset.months.minValue,
                upperLimit: (_t = preset.months.upperLimit) !== null && _t !== void 0 ? _t : preset.months.maxValue,
            },
            daysOfWeek: {
                lowerLimit: (_u = preset.daysOfWeek.lowerLimit) !== null && _u !== void 0 ? _u : preset.daysOfWeek.minValue,
                upperLimit: (_v = preset.daysOfWeek.upperLimit) !== null && _v !== void 0 ? _v : preset.daysOfWeek.maxValue,
            },
            years: {
                lowerLimit: (_w = preset.years.lowerLimit) !== null && _w !== void 0 ? _w : preset.years.minValue,
                upperLimit: (_x = preset.years.upperLimit) !== null && _x !== void 0 ? _x : preset.years.maxValue,
            },
        }), inputOptions.override);
        const optionsSchema = yup
            .object({
            presetId: yup.string().required(),
            preset: optionPresetSchema.required(),
            useSeconds: yup.boolean().required(),
            useYears: yup.boolean().required(),
            useAliases: yup.boolean(),
            useBlankDay: yup.boolean().required(),
            allowOnlyOneBlankDayField: yup.boolean().required(),
            mustHaveBlankDayField: yup.boolean(),
            useLastDayOfMonth: yup.boolean(),
            useLastDayOfWeek: yup.boolean(),
            useNearestWeekday: yup.boolean(),
            lobaroUseListOfNearestWeekdays: yup.boolean(),
            lobaroUseHashValue: yup.boolean(),
            useNthWeekdayOfMonth: yup.boolean(),
            seconds: yup
                .object({
                lowerLimit: yup
                    .number()
                    .min(preset.seconds.minValue)
                    .max(preset.seconds.maxValue),
                upperLimit: yup
                    .number()
                    .min(preset.seconds.minValue)
                    .max(preset.seconds.maxValue),
            })
                .required(),
            minutes: yup
                .object({
                lowerLimit: yup
                    .number()
                    .min(preset.minutes.minValue)
                    .max(preset.minutes.maxValue),
                upperLimit: yup
                    .number()
                    .min(preset.minutes.minValue)
                    .max(preset.minutes.maxValue),
            })
                .required(),
            hours: yup
                .object({
                lowerLimit: yup
                    .number()
                    .min(preset.hours.minValue)
                    .max(preset.hours.maxValue),
                upperLimit: yup
                    .number()
                    .min(preset.hours.minValue)
                    .max(preset.hours.maxValue),
            })
                .required(),
            daysOfMonth: yup
                .object({
                lowerLimit: yup
                    .number()
                    .min(preset.daysOfMonth.minValue)
                    .max(preset.daysOfMonth.maxValue),
                upperLimit: yup
                    .number()
                    .min(preset.daysOfMonth.minValue)
                    .max(preset.daysOfMonth.maxValue),
            })
                .required(),
            months: yup
                .object({
                lowerLimit: yup
                    .number()
                    .min(preset.months.minValue)
                    .max(preset.months.maxValue),
                upperLimit: yup
                    .number()
                    .min(preset.months.minValue)
                    .max(preset.months.maxValue),
            })
                .required(),
            daysOfWeek: yup
                .object({
                lowerLimit: yup
                    .number()
                    .min(preset.daysOfWeek.minValue)
                    .max(preset.daysOfWeek.maxValue),
                upperLimit: yup
                    .number()
                    .min(preset.daysOfWeek.minValue)
                    .max(preset.daysOfWeek.maxValue),
            })
                .required(),
            years: yup
                .object({
                lowerLimit: yup
                    .number()
                    .min(preset.years.minValue)
                    .max(preset.years.maxValue),
                upperLimit: yup
                    .number()
                    .min(preset.years.minValue)
                    .max(preset.years.maxValue),
            })
                .required(),
        })
            .required();
        const validatedConfig = optionsSchema.validateSync(unvalidatedConfig, {
            strict: false,
            abortEarly: false,
            stripUnknown: true,
            recursive: true,
        });
        return result_1.valid(validatedConfig);
    }
    catch (validationError) {
        return result_1.err(validationError.errors);
    }
};
exports.validateOptions = validateOptions;
