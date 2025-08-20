declare const _default: ({
    name: string;
    preset: {
        presetId: string;
        useSeconds: boolean;
        useYears: boolean;
        useAliases: boolean;
        useBlankDay: boolean;
        allowOnlyOneBlankDayField: boolean;
        mustHaveBlankDayField: boolean;
        lobaroMustHaveBlankDayField: boolean;
        lobaroUseHashValue: boolean;
        useLastDayOfMonth: boolean;
        useLastDayOfWeek: boolean;
        useNearestWeekday: boolean;
        lobaroUseListOfNearestWeekdays: boolean;
        useNthWeekdayOfMonth: boolean;
        seconds: {
            minValue: number;
            maxValue: number;
        };
        minutes: {
            minValue: number;
            maxValue: number;
        };
        hours: {
            minValue: number;
            maxValue: number;
        };
        daysOfMonth: {
            minValue: number;
            maxValue: number;
        };
        months: {
            minValue: number;
            maxValue: number;
        };
        daysOfWeek: {
            minValue: number;
            maxValue: number;
        };
        years: {
            minValue: number;
            maxValue: number;
        };
    };
} | {
    name: string;
    preset: {
        presetId: string;
        useSeconds: boolean;
        useYears: boolean;
        useAliases: boolean;
        useBlankDay: boolean;
        allowOnlyOneBlankDayField: boolean;
        mustHaveBlankDayField: boolean;
        useLastDayOfMonth: boolean;
        useLastDayOfWeek: boolean;
        useNearestWeekday: boolean;
        useNthWeekdayOfMonth: boolean;
        seconds: {
            minValue: number;
            maxValue: number;
        };
        minutes: {
            minValue: number;
            maxValue: number;
        };
        hours: {
            minValue: number;
            maxValue: number;
        };
        daysOfMonth: {
            minValue: number;
            maxValue: number;
        };
        months: {
            minValue: number;
            maxValue: number;
        };
        daysOfWeek: {
            minValue: number;
            maxValue: number;
        };
        years: {
            minValue: number;
            maxValue: number;
        };
        lobaroMustHaveBlankDayField?: undefined;
        lobaroUseHashValue?: undefined;
        lobaroUseListOfNearestWeekdays?: undefined;
    };
})[];
export default _default;
