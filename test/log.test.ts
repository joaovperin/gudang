import * as gudangjs from "../src";
import { LogLevel } from "../src";

const Log = gudangjs.Log as any;

const cases = [
    [LogLevel.TRACE, 5],
    [LogLevel.DEBUG, 4],
    [LogLevel.INFO, 3],
    [LogLevel.WARN, 2],
    [LogLevel.ERROR, 1],
];

describe("Log", () => {
    test.each(cases)(
        "when level is %s, log should be called %i times",
        ((level: string, expected: number) => {
            Log.log = jest.fn();
            gudangjs.Log.level = level as LogLevel;
            Log.trace("trace");
            Log.debug("debug");
            Log.info("info");
            Log.warn("warn");
            Log.error("error");
            expect(Log.log).toHaveBeenCalledTimes(expected);
        }) as any
    );
});
