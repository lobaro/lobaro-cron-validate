"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("./result");
const secondChecker_1 = __importDefault(require("./fieldCheckers/secondChecker"));
const minuteChecker_1 = __importDefault(require("./fieldCheckers/minuteChecker"));
const hourChecker_1 = __importDefault(require("./fieldCheckers/hourChecker"));
const dayOfMonthChecker_1 = __importDefault(require("./fieldCheckers/dayOfMonthChecker"));
const monthChecker_1 = __importDefault(require("./fieldCheckers/monthChecker"));
const dayOfWeekChecker_1 = __importDefault(require("./fieldCheckers/dayOfWeekChecker"));
const yearChecker_1 = __importDefault(require("./fieldCheckers/yearChecker"));
const option_1 = require("./option");
require("./types");
const splitCronString = (cronString, options) => {
    const splittedCronString = cronString.trim().split(' ');
    if (options.useSeconds &&
        options.useYears &&
        splittedCronString.length !== 7) {
        return result_1.err(`Expected 7 values, but got ${splittedCronString.length}.`);
    }
    if (((options.useSeconds && !options.useYears) ||
        (options.useYears && !options.useSeconds)) &&
        splittedCronString.length !== 6) {
        return result_1.err(`Expected 6 values, but got ${splittedCronString.length}.`);
    }
    if (!options.useSeconds &&
        !options.useYears &&
        splittedCronString.length !== 5) {
        return result_1.err(`Expected 5 values, but got ${splittedCronString.length}.`);
    }
    const cronData = {
        seconds: options.useSeconds ? splittedCronString[0] : undefined,
        minutes: splittedCronString[options.useSeconds ? 1 : 0],
        hours: splittedCronString[options.useSeconds ? 2 : 1],
        daysOfMonth: splittedCronString[options.useSeconds ? 3 : 2],
        months: splittedCronString[options.useSeconds ? 4 : 3],
        daysOfWeek: splittedCronString[options.useSeconds ? 5 : 4],
        years: options.useYears
            ? splittedCronString[options.useSeconds ? 6 : 5]
            : undefined,
    };
    return result_1.valid(cronData);
};
const cron = (cronString, inputOptions = {}) => {
    // Validate option
    const optionsResult = option_1.validateOptions(inputOptions);
    if (optionsResult.isError()) {
        return optionsResult;
    }
    const options = optionsResult.getValue();
    const cronDataResult = splitCronString(cronString, options);
    if (cronDataResult.isError()) {
        return result_1.err([`${cronDataResult.getError()} (Input cron: '${cronString}')`]);
    }
    const cronData = cronDataResult.getValue();
    const checkResults = [];
    if (options.useSeconds) {
        checkResults.push(secondChecker_1.default(cronData, options));
    }
    checkResults.push(minuteChecker_1.default(cronData, options));
    checkResults.push(hourChecker_1.default(cronData, options));
    checkResults.push(dayOfMonthChecker_1.default(cronData, options));
    checkResults.push(monthChecker_1.default(cronData, options));
    checkResults.push(dayOfWeekChecker_1.default(cronData, options));
    if (options.useYears) {
        checkResults.push(yearChecker_1.default(cronData, options));
    }
    if (checkResults.every(value => value.isValid())) {
        return result_1.valid(cronData);
    }
    // TODO: Right error return
    const errorArray = [];
    checkResults.forEach(result => {
        if (result.isError()) {
            result.getError().forEach((error) => {
                errorArray.push(error);
            });
        }
    });
    // Make sure cron string is in every error
    errorArray.forEach((error, index) => {
        errorArray[index] = `${error} (Input cron: '${cronString}')`;
    });
    return result_1.err(errorArray);
};
exports.default = cron;
module.exports = cron;
module.exports.default = cron;
