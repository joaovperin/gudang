import * as gudangjs from "../src";

const Log = gudangjs.Log as any;

describe("Log", () => {
    it("trace", () => {
        Log.log = jest.fn();
        gudangjs.Log.level = gudangjs.LogLevel.TRACE;
        Log.trace("trace");
        Log.debug("debug");
        Log.info("info");
        Log.warn("warn");
        Log.error("error");
        expect(Log.log).toHaveBeenCalledTimes(5);
    });

    it("debug", () => {
        Log.log = jest.fn();
        gudangjs.Log.level = gudangjs.LogLevel.DEBUG;
        Log.trace("trace");
        Log.debug("debug");
        Log.info("info");
        Log.warn("warn");
        Log.error("error");
        expect(Log.log).toHaveBeenCalledTimes(4);
    });

    it("info", () => {
        Log.log = jest.fn();
        gudangjs.Log.level = gudangjs.LogLevel.INFO;
        Log.trace("trace");
        Log.debug("debug");
        Log.info("info");
        Log.warn("warn");
        Log.error("error");
        expect(Log.log).toHaveBeenCalledTimes(3);
    });

    it("warn", () => {
        Log.log = jest.fn();
        gudangjs.Log.level = gudangjs.LogLevel.WARN;
        Log.trace("trace");
        Log.debug("debug");
        Log.info("info");
        Log.warn("warn");
        Log.error("error");
        expect(Log.log).toHaveBeenCalledTimes(2);

    });

    it("error", () => {
        Log.log = jest.fn();
        gudangjs.Log.level = gudangjs.LogLevel.ERROR;
        Log.trace("trace");
        Log.debug("debug");
        Log.info("info");
        Log.warn("warn");
        Log.error("error");
        expect(Log.log).toHaveBeenCalledTimes(1);
    });
});