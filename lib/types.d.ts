declare type OptionPresetFieldOptions = {
    minValue: number;
    maxValue: number;
    lowerLimit?: number;
    upperLimit?: number;
};
declare type FieldOption = {
    lowerLimit?: number;
    upperLimit?: number;
};
declare type Fields<T> = {
    seconds: T;
    minutes: T;
    hours: T;
    daysOfMonth: T;
    months: T;
    daysOfWeek: T;
    years: T;
};
declare type ExtendFields = {
    useSeconds: boolean;
    useYears: boolean;
};
declare type ExtendWildcards = {
    useBlankDay: boolean;
    allowOnlyOneBlankDayField: boolean;
    useAliases?: boolean;
    mustHaveBlankDayField?: boolean;
    useLastDayOfMonth?: boolean;
    useLastDayOfWeek?: boolean;
    useNearestWeekday?: boolean;
    lobaroUseListOfNearestWeekdays?: boolean;
    lobaroUseHashValue?: boolean;
    useNthWeekdayOfMonth?: boolean;
};
export declare type OptionPreset = {
    presetId: string;
} & Fields<OptionPresetFieldOptions> & ExtendFields & ExtendWildcards;
export declare type Options = {
    presetId: string;
    preset: OptionPreset;
} & Fields<FieldOption> & ExtendFields & ExtendWildcards;
export declare type InputOptions = {
    preset?: string | OptionPreset;
    override?: Partial<Fields<FieldOption>> & Partial<ExtendFields> & Partial<ExtendWildcards>;
} & Partial<Fields<FieldOption>> & Partial<ExtendFields>;
export {};
