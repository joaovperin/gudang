import * as gudangjs from "../src";
import { LogLevel, LogLine } from "../src";

const Log = gudangjs.Log as any;

describe("String Substitution", () => {
    let mockAppender: { append: jest.Mock; flush: jest.Mock };

    beforeEach(() => {
        mockAppender = {
            append: jest.fn(),
            flush: jest.fn()
        };
        Log.setAppenders([mockAppender]);
        Log.level = LogLevel.TRACE; // Enable all levels for testing
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Basic substitution", () => {
        test("should substitute single placeholder", () => {
            Log.info("Hello {}", "World");
            
            expect(mockAppender.append).toHaveBeenCalledTimes(1);
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Hello World");
            expect(logLine.level).toBe(LogLevel.INFO);
            expect(logLine.error).toBeUndefined();
        });

        test("should substitute multiple placeholders", () => {
            Log.debug("User {} has {} points", "Alice", 150);
            
            expect(mockAppender.append).toHaveBeenCalledTimes(1);
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("User Alice has 150 points");
        });

        test("should handle different data types", () => {
            Log.warn("Values: {}, {}, {}", 42, true, null);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Values: 42, true, null");
        });

        test("should handle objects and arrays", () => {
            const obj = { name: "test" };
            const arr = [1, 2, 3];
            Log.error("Object: {}, Array: {}", obj, arr);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Object: [object Object], Array: 1,2,3");
        });
    });

    describe("Edge cases", () => {
        test("should handle more placeholders than arguments", () => {
            Log.info("Hello {} and {}", "World");
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Hello World and {}");
        });

        test("should handle more arguments than placeholders", () => {
            Log.info("Hello {}", "World", "Extra");
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Hello World");
        });

        test("should handle no placeholders with arguments", () => {
            Log.info("No placeholders", "arg1", "arg2");
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("No placeholders");
        });

        test("should handle empty placeholders", () => {
            Log.info("Empty: {}", "");
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Empty: ");
        });

        test("should handle undefined and null arguments", () => {
            Log.info("Values: {}, {}", undefined, null);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Values: undefined, null");
        });
    });

    describe("All log levels", () => {
        test("should work with trace level", () => {
            Log.trace("Trace message with {}", "substitution");
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Trace message with substitution");
            expect(logLine.level).toBe(LogLevel.TRACE);
        });

        test("should work with debug level", () => {
            Log.debug("Debug message with {}", "substitution");
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Debug message with substitution");
            expect(logLine.level).toBe(LogLevel.DEBUG);
        });

        test("should work with warn level", () => {
            Log.warn("Warn message with {}", "substitution");
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Warn message with substitution");
            expect(logLine.level).toBe(LogLevel.WARN);
        });

        test("should work with error level", () => {
            Log.error("Error message with {}", "substitution");
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Error message with substitution");
            expect(logLine.level).toBe(LogLevel.ERROR);
        });
    });
});