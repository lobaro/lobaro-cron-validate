"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../index");
const result_1 = require("../result");
const helper_1 = __importDefault(require("../helper"));
require("../types");
const checkDaysOfMonth = (cronData, options) => {
    if (!cronData.daysOfMonth) {
        return result_1.err(['daysOfMonth field is undefined.']);
    }
    const { daysOfMonth } = cronData;
    if (options.allowOnlyOneBlankDayField &&
        options.useBlankDay &&
        cronData.daysOfMonth === '?' &&
        cronData.daysOfWeek === '?') {
        return result_1.err([
            `Cannot use blank value in daysOfMonth and daysOfWeek field when allowOnlyOneBlankDayField option is enabled.`,
        ]);
    }
    if (options.mustHaveBlankDayField &&
        cronData.daysOfMonth !== '?' &&
        cronData.daysOfWeek !== '?') {
        return result_1.err([
            `Cannot specify both daysOfMonth and daysOfWeek field when mustHaveBlankDayField option is enabled.`,
        ]);
    }
    // Based on this implementation logic:
    // https://github.com/quartz-scheduler/quartz/blob/1e0ed76c5c141597eccd76e44583557729b5a7cb/quartz-core/src/main/java/org/quartz/CronExpression.java#L473
    // For Lobaro CRONs, LW is allowed in lists
    if (options.useLastDayOfMonth &&
        cronData.daysOfMonth.indexOf('L') !== -1 &&
        (cronData.daysOfMonth.match(/\//) ||
            (!options.useNearestWeekday &&
                !options.lobaroUseListOfNearestWeekdays &&
                cronData.daysOfMonth.indexOf('LW') === -1 &&
                cronData.daysOfMonth.match(/,/)))) {
        return result_1.err([
            `Cannot specify last day of month with ranges (/), lists (,) only with last weekday.`,
        ]);
    }
    if (options.useNearestWeekday &&
        cronData.daysOfMonth.indexOf('W') !== -1 &&
        !options.lobaroUseListOfNearestWeekdays &&
        cronData.daysOfMonth.match(/[,/-]/)) {
        return result_1.err([
            `Cannot specify nearest weekday with lists, steps or ranges (symbols ,-/).`,
        ]);
    }
    return helper_1.default(daysOfMonth, 'daysOfMonth', options);
};
exports.default = checkDaysOfMonth;
