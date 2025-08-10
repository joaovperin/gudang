import * as gudangjs from "../src";
import { LogLevel, LogLine } from "../src";

const Log = gudangjs.Log as any;

describe("Variable Arguments", () => {
    let mockAppender: { append: jest.Mock; flush: jest.Mock };

    beforeEach(() => {
        mockAppender = {
            append: jest.fn(),
            flush: jest.fn()
        };
        Log.setAppenders([mockAppender]);
        Log.level = LogLevel.TRACE;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Argument count variations", () => {
        test("should handle zero arguments", () => {
            Log.info("No arguments");
            
            expect(mockAppender.append).toHaveBeenCalledTimes(1);
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("No arguments");
            expect(logLine.error).toBeUndefined();
        });

        test("should handle single argument", () => {
            Log.info("Single argument: {}", "value");
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Single argument: value");
        });

        test("should handle multiple arguments", () => {
            Log.info("Multiple: {}, {}, {}, {}", "a", 1, true, [1, 2]);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Multiple: a, 1, true, 1,2");
        });

        test("should handle many arguments", () => {
            Log.info("Many: {} {} {} {} {} {} {} {} {} {}", 
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Many: 1 2 3 4 5 6 7 8 9 10");
        });
    });

    describe("Mixed argument types", () => {
        test("should handle primitives", () => {
            Log.debug("Primitives: {}, {}, {}, {}", 
                42, "string", true, Symbol("test"));
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toContain("Primitives: 42, string, true, Symbol(test)");
        });

        test("should handle objects and arrays", () => {
            const obj = { key: "value", num: 123 };
            const arr = ["a", "b", "c"];
            Log.warn("Complex: {}, {}", obj, arr);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Complex: [object Object], a,b,c");
        });

        test("should handle functions", () => {
            const fn = () => "test";
            Log.info("Function: {}", fn);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toContain("Function: () => \"test\"");
        });

        test("should handle Date objects", () => {
            const date = new Date("2023-01-01T12:00:00.000Z");
            Log.info("Date: {}", date);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toContain("Date: ");
            expect(logLine.text).toMatch(/Date: .*Jan.*2023|Date: .*2023/);
        });
    });

    describe("Arguments with Error objects", () => {
        test("should separate Error from substitution args", () => {
            const error = new Error("Test error");
            Log.error("Args: {}, {}, {}", "a", "b", "c", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Args: a, b, c");
            expect(logLine.error).toBe(error);
        });

        test("should handle Error in middle and end", () => {
            const error1 = new Error("Middle error");
            const error2 = new Error("End error");
            Log.error("Errors: {}, {}", error1.message, "other", error2);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Errors: Middle error, other");
            expect(logLine.error).toBe(error2); // Only last Error is treated as error object
        });

        test("should handle only Error argument", () => {
            const error = new Error("Only error");
            Log.error("Message only", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Message only");
            expect(logLine.error).toBe(error);
        });
    });

    describe("Backward compatibility", () => {
        test("should work with old single string parameter", () => {
            Log.info("Simple message");
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Simple message");
            expect(logLine.error).toBeUndefined();
        });

        test("should handle existing code patterns", () => {
            // This tests the old way still works
            Log.warn("Old style warning message");
            Log.error("Old style error message");
            
            expect(mockAppender.append).toHaveBeenCalledTimes(2);
            expect(mockAppender.append.mock.calls[0][0].text).toBe("Old style warning message");
            expect(mockAppender.append.mock.calls[1][0].text).toBe("Old style error message");
        });
    });

    describe("Level filtering with arguments", () => {
        test("should respect log levels with arguments", () => {
            Log.level = LogLevel.ERROR;
            
            Log.debug("Debug with {}", "args"); // Should not log
            Log.info("Info with {}", "args");  // Should not log
            Log.warn("Warn with {}", "args");  // Should not log
            Log.error("Error with {}", "args"); // Should log
            
            expect(mockAppender.append).toHaveBeenCalledTimes(1);
            expect(mockAppender.append.mock.calls[0][0].text).toBe("Error with args");
        });

        test("should handle TRACE level correctly", () => {
            Log.level = LogLevel.TRACE;
            
            Log.trace("Trace with {}", "substitution");
            
            expect(mockAppender.append).toHaveBeenCalledTimes(1);
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.level).toBe(LogLevel.TRACE);
            expect(logLine.text).toBe("Trace with substitution");
        });
    });

    describe("Performance edge cases", () => {
        test("should handle empty string substitutions", () => {
            Log.info("{}{}{}", "", "", "");
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("");
        });

        test("should handle very long argument lists", () => {
            const args = Array(50).fill(0).map((_, i) => `arg${i}`);
            const template = "Args: " + Array(50).fill("{}").join(", ");
            
            Log.info(template, ...args);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toContain("Args: arg0, arg1");
            expect(logLine.text).toContain("arg49");
        });

        test("should handle circular references gracefully", () => {
            const circular: any = { name: "circular" };
            circular.self = circular;
            
            Log.info("Circular: {}", circular);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Circular: [object Object]");
        });
    });
});