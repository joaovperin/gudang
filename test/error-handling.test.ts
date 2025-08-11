import * as gudangjs from "../src";
import { LogLevel, LogLine } from "../src";

const Log = gudangjs.Log as any;

describe("Error Handling", () => {
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

    describe("Error object detection", () => {
        test("should detect Error as object argument", () => {
            const error = new Error("Test error");
            Log.error("Something failed", error);
            
            expect(mockAppender.append).toHaveBeenCalledTimes(1);
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Something failed");
            expect(logLine.objects).toContain(error);
            expect(logLine.error).toBe(error);
        });

        test("should detect Error after substitution arguments", () => {
            const error = new Error("Connection timeout");
            Log.error("Client {} failed", "ClientA", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Client ClientA failed");
            expect(logLine.objects).toContain(error);
            expect(logLine.error).toBe(error);
        });

        test("should handle Error and other objects in arguments", () => {
            const error = new Error("Middleware error");
            const userData = { id: 123, name: "ClientB" };
            Log.warn("Client {} threw error: {}", userData.name, error.message, userData, error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Client ClientB threw error: Middleware error");
            expect(logLine.objects).toContain(error);
            expect(logLine.objects).toContain(userData);
            expect(logLine.error).toBe(error);
        });

        test("should store Error-like objects but not treat them as errors", () => {
            const fakeError = { message: "fake", stack: "fake stack" };
            Log.error("Fake error: {}", fakeError);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Fake error: [object Object]");
            expect(logLine.objects).toContain(fakeError);
            expect(logLine.error).toBeUndefined(); // Only actual Error instances
        });
    });

    describe("Error types", () => {
        test("should handle standard Error", () => {
            const error = new Error("Standard error");
            Log.error("Error occurred", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.error).toBeInstanceOf(Error);
            expect(logLine.error?.message).toBe("Standard error");
        });

        test("should handle TypeError", () => {
            const error = new TypeError("Type error");
            Log.error("Type error occurred", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.error).toBeInstanceOf(TypeError);
            expect(logLine.error?.message).toBe("Type error");
        });

        test("should handle RangeError", () => {
            const error = new RangeError("Range error");
            Log.error("Range error occurred", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.error).toBeInstanceOf(RangeError);
            expect(logLine.error?.message).toBe("Range error");
        });

        test("should handle custom Error subclasses", () => {
            class CustomError extends Error {
                constructor(message: string) {
                    super(message);
                    this.name = "CustomError";
                }
            }
            
            const error = new CustomError("Custom error");
            Log.error("Custom error occurred", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.error).toBeInstanceOf(CustomError);
            expect(logLine.error?.message).toBe("Custom error");
            expect(logLine.error?.name).toBe("CustomError");
        });
    });

    describe("Error without substitution", () => {
        test("should handle error-only logging", () => {
            const error = new Error("Standalone error");
            Log.error("Database connection failed", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Database connection failed");
            expect(logLine.error).toBe(error);
        });

        test("should handle multiple errors (first error is returned by .error getter)", () => {
            const error1 = new Error("First error");
            const error2 = new Error("Second error");
            Log.error("Multiple issues: {}", error1.message, error1, error2);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Multiple issues: First error");
            expect(logLine.objects).toContain(error1);
            expect(logLine.objects).toContain(error2);
            expect(logLine.error).toBe(error1); // First error found
        });
    });

    describe("Error with all log levels", () => {
        test("should work with trace level", () => {
            const error = new Error("Trace error");
            Log.trace("Trace with error", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.level).toBe(LogLevel.TRACE);
            expect(logLine.error).toBe(error);
        });

        test("should work with debug level", () => {
            const error = new Error("Debug error");
            Log.debug("Debug with error", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.level).toBe(LogLevel.DEBUG);
            expect(logLine.error).toBe(error);
        });

        test("should work with info level", () => {
            const error = new Error("Info error");
            Log.info("Info with error", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.level).toBe(LogLevel.INFO);
            expect(logLine.error).toBe(error);
        });

        test("should work with warn level", () => {
            const error = new Error("Warn error");
            Log.warn("Warn with error", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.level).toBe(LogLevel.WARN);
            expect(logLine.error).toBe(error);
        });
    });

    describe("Edge cases", () => {
        test("should handle null as last argument", () => {
            Log.error("Null argument", null);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Null argument");
            expect(logLine.error).toBeUndefined();
        });

        test("should handle undefined as last argument", () => {
            Log.error("Undefined argument", undefined);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Undefined argument");
            expect(logLine.error).toBeUndefined();
        });

        test("should handle empty Error message", () => {
            const error = new Error("");
            Log.error("Empty error message", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.error).toBe(error);
            expect(logLine.error?.message).toBe("");
        });
    });
});