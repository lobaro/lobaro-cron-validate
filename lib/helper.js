"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./index");
const result_1 = require("./result");
require("./types");
// Instead of translating the alias to a number, we just validate that it's an accepted alias.
// This is to avoid managing the limits with the translation to numbers.
// e.g.: For AWS, sun = 1, while for normal cron, sun = 0. Translating to numbers would break that.
const monthAliases = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
];
const daysOfWeekAliases = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const checkWildcardLimit = (cronFieldType, options) => (options[cronFieldType].lowerLimit ===
    options.preset[cronFieldType].minValue &&
    options[cronFieldType].upperLimit === options.preset[cronFieldType].maxValue);
const checkSingleElementWithinLimits = (element, cronFieldType, options) => {
    if (cronFieldType === 'months' &&
        options.useAliases &&
        monthAliases.indexOf(element.toLowerCase()) !== -1) {
        return result_1.valid(true);
    }
    if (cronFieldType === 'daysOfWeek' &&
        options.useAliases &&
        daysOfWeekAliases.indexOf(element.toLowerCase()) !== -1) {
        return result_1.valid(true);
    }
    const number = Number(element);
    if (isNaN(number)) {
        return result_1.err(`Element '${element} of ${cronFieldType} field is invalid.`);
    }
    const { lowerLimit } = options[cronFieldType];
    const { upperLimit } = options[cronFieldType];
    if (lowerLimit && number < lowerLimit) {
        return result_1.err(`Number ${number} of ${cronFieldType} field is smaller than lower limit '${lowerLimit}'`);
    }
    if (upperLimit && number > upperLimit) {
        return result_1.err(`Number ${number} of ${cronFieldType} field is bigger than upper limit '${upperLimit}'`);
    }
    return result_1.valid(true);
};
const checkSingleElement = (element, cronFieldType, options) => {
    if (element === '*') {
        if (!checkWildcardLimit(cronFieldType, options)) {
            return result_1.err(`Field ${cronFieldType} uses wildcard '*', but is limited to ${options[cronFieldType].lowerLimit}-${options[cronFieldType].upperLimit}`);
        }
        return result_1.valid(true);
    }
    if (element === '') {
        return result_1.err(`One of the elements is empty in ${cronFieldType} field.`);
    }
    if (cronFieldType === 'daysOfMonth' &&
        options.useLastDayOfMonth &&
        element === 'L') {
        return result_1.valid(true);
    }
    // We must do that check here because L is used with a number to specify the day of the week for which
    // we look for the last occurrence in the month.
    // We use `endsWith` here because anywhere else is not valid so it will be caught later on.
    if (cronFieldType === 'daysOfWeek' &&
        options.useLastDayOfWeek &&
        element.endsWith('L')) {
        const day = element.slice(0, -1);
        if (day === '') {
            // This means that element is only `L` which is the equivalent of saturdayL
            return result_1.valid(true);
        }
        return checkSingleElementWithinLimits(day, cronFieldType, options);
    }
    // We must do that check here because W is used with a number to specify the day of the month for which
    // we must run over a weekday instead.
    // We use `endsWith` here because anywhere else is not valid so it will be caught later on.
    if (cronFieldType === 'daysOfMonth' &&
        options.useNearestWeekday &&
        element.endsWith('W')) {
        const day = element.slice(0, -1);
        if (day === '') {
            return result_1.err(`The 'W' must be preceded by a day`);
        }
        // Edge case where the L can be used with W to form last weekday of month
        if (options.useLastDayOfMonth && day === 'L') {
            return result_1.valid(true);
        }
        return checkSingleElementWithinLimits(day, cronFieldType, options);
    }
    if (cronFieldType === 'daysOfWeek' &&
        options.useNthWeekdayOfMonth &&
        element.indexOf('#') !== -1) {
        const [day, occurrence, ...leftOvers] = element.split('#');
        if (leftOvers.length !== 0) {
            return result_1.err(`Unexpected number of '#' in ${element}, can only be used once.`);
        }
        const occurrenceNum = Number(occurrence);
        if (!occurrence || isNaN(occurrenceNum)) {
            return result_1.err(`Unexpected value following the '#' symbol, a positive number was expected but found ${occurrence}.`);
        }
        return checkSingleElementWithinLimits(day, cronFieldType, options);
    }
    return checkSingleElementWithinLimits(element, cronFieldType, options);
};
const checkRangeElement = (element, cronFieldType, options, position) => {
    if (element === '*') {
        return result_1.err(`'*' can't be part of a range in ${cronFieldType} field.`);
    }
    if (element === '') {
        return result_1.err(`One of the range elements is empty in ${cronFieldType} field.`);
    }
    // We can have `L` as the first element of a range to specify an offset.
    if (options.useLastDayOfMonth &&
        cronFieldType === 'daysOfMonth' &&
        element === 'L' &&
        position === 0) {
        return result_1.valid(true);
    }
    return checkSingleElementWithinLimits(element, cronFieldType, options);
};
const checkFirstStepElement = (firstStepElement, cronFieldType, options) => {
    const rangeArray = firstStepElement.split('-');
    if (rangeArray.length > 2) {
        return result_1.err(`List element '${firstStepElement}' is not valid. (More than one '-')`);
    }
    if (rangeArray.length === 1) {
        return checkSingleElement(rangeArray[0], cronFieldType, options);
    }
    if (rangeArray.length === 2) {
        const firstRangeElementResult = checkRangeElement(rangeArray[0], cronFieldType, options, 0);
        const secondRangeElementResult = checkRangeElement(rangeArray[1], cronFieldType, options, 1);
        if (firstRangeElementResult.isError()) {
            return firstRangeElementResult;
        }
        if (secondRangeElementResult.isError()) {
            return secondRangeElementResult;
        }
        if (Number(rangeArray[0]) > Number(rangeArray[1])) {
            return result_1.err(`Lower range end '${rangeArray[0]}' is bigger than upper range end '${rangeArray[1]}' of ${cronFieldType} field.`);
        }
        return result_1.valid(true);
    }
    return result_1.err('Some other error in checkFirstStepElement (rangeArray less than 1)');
};
const checkHashedElement = (element, cronFieldType, options) => {
    // List element has to start with 'H'
    if (element[0] !== "H") {
        return result_1.err("Hashed value doesn't begin field");
    }
    // Simplest case
    if (element === "H") {
        return result_1.valid(true);
    }
    // Split off iterator, if present
    const stepArray = element.split('/');
    if (stepArray.length > 2) {
        return result_1.err(`Hashed element '${element}' is not valid. (More than one '/')`);
    }
    // Verify step if present
    if (stepArray.length === 2) {
        const secondStepElement = stepArray[1];
        // Verify step is valid
        if (!secondStepElement) {
            return result_1.err(`Second step element '${secondStepElement}' of '${element}' is not valid (doesnt exist).`);
        }
        if (isNaN(Number(secondStepElement))) {
            return result_1.err(`Second step element '${secondStepElement}' of '${element}' is not valid (not a number).`);
        }
        if (Number(secondStepElement) === 0) {
            return result_1.err(`Second step element '${secondStepElement}' of '${element}' cannot be zero.`);
        }
        // If first element is 'H' only, return valid field
        if (stepArray[0] === "H") {
            return result_1.valid(true);
        }
    }
    // Range present?
    const rangeMatch = stepArray[0].match(/^H\((\d{1,2})-(\d{1,2})\)$/);
    if (rangeMatch === null) {
        return result_1.err(`Hashed element ${element} doesn't contain a valid iterator range.`);
    }
    const rangeStartResult = checkRangeElement(rangeMatch[1], cronFieldType, options, 0);
    if (rangeStartResult.isError()) {
        return rangeStartResult;
    }
    const rangeEndResult = checkRangeElement(rangeMatch[2], cronFieldType, options, 1);
    if (rangeEndResult.isError()) {
        return rangeEndResult;
    }
    if (Number(rangeMatch[1]) > Number(rangeMatch[2])) {
        return result_1.err(`Lower range end '${rangeMatch[1]}' is bigger than upper range end '${rangeMatch[2]}' of ${cronFieldType} field.`);
    }
    return result_1.valid(true);
};
const checkListElement = (listElement, cronFieldType, options) => {
    if (options.lobaroUseHashValue && listElement.match(/H/)) {
        return checkHashedElement(listElement, cronFieldType, options);
    }
    // Checks list element for steps like */2, 10-20/2
    const stepArray = listElement.split('/');
    if (stepArray.length > 2) {
        return result_1.err(`List element '${listElement}' is not valid. (More than one '/')`);
    }
    const firstElementResult = checkFirstStepElement(stepArray[0], cronFieldType, options);
    if (firstElementResult.isError()) {
        return firstElementResult;
    }
    if (stepArray.length === 2) {
        const secondStepElement = stepArray[1];
        if (!secondStepElement) {
            return result_1.err(`Second step element '${secondStepElement}' of '${listElement}' is not valid (doesnt exist).`);
        }
        if (isNaN(Number(secondStepElement))) {
            return result_1.err(`Second step element '${secondStepElement}' of '${listElement}' is not valid (not a number).`);
        }
        if (Number(secondStepElement) === 0) {
            return result_1.err(`Second step element '${secondStepElement}' of '${listElement}' cannot be zero.`);
        }
    }
    return result_1.valid(true);
};
const checkField = (cronField, cronFieldType, options) => {
    if (![
        'seconds',
        'minutes',
        'hours',
        'daysOfMonth',
        'months',
        'daysOfWeek',
        'years',
    ].includes(cronFieldType)) {
        return result_1.err([`Cron field type '${cronFieldType}' does not exist.`]);
    }
    // Check for blank day
    if (cronField === '?') {
        if (cronFieldType === 'daysOfMonth' || cronFieldType === 'daysOfWeek') {
            if (options.useBlankDay) {
                return result_1.valid(true);
            }
            return result_1.err([
                `useBlankDay is not enabled, but is used in ${cronFieldType} field`,
            ]);
        }
        return result_1.err([`blank notation is not allowed in ${cronFieldType} field`]);
    }
    // Check for lists e.g. 4,5,6,8-18,20-40/2
    const listArray = cronField.split(',');
    const checkResults = [];
    listArray.forEach((listElement) => {
        checkResults.push(checkListElement(listElement, cronFieldType, options));
    });
    if (checkResults.every(value => value.isValid())) {
        return result_1.valid(true);
    }
    const errorArray = [];
    checkResults.forEach(result => {
        if (result.isError()) {
            errorArray.push(result.getError());
        }
    });
    return result_1.err(errorArray);
};
exports.default = checkField;
