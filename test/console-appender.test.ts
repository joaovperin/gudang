import { ConsoleLogAppender, RawLogFormatter } from "../src";
import { LogLevel, LogLine } from "../src";

describe("Console Appender Error Display", () => {
    let consoleLogAppender: ConsoleLogAppender;
    let consoleSpy: {
        trace: jest.SpyInstance;
        debug: jest.SpyInstance;
        info: jest.SpyInstance;
        warn: jest.SpyInstance;
        error: jest.SpyInstance;
    };

    beforeEach(() => {
        // Use raw formatter to get just the message text without timestamp/level prefix
        consoleLogAppender = new ConsoleLogAppender(new RawLogFormatter());
        
        // Mock all console methods
        consoleSpy = {
            trace: jest.spyOn(console, 'trace').mockImplementation(),
            debug: jest.spyOn(console, 'debug').mockImplementation(),
            info: jest.spyOn(console, 'info').mockImplementation(),
            warn: jest.spyOn(console, 'warn').mockImplementation(),
            error: jest.spyOn(console, 'error').mockImplementation()
        };
    });

    afterEach(() => {
        // Restore all console methods
        Object.values(consoleSpy).forEach(spy => spy.mockRestore());
    });

    describe("Error object display", () => {
        test("should display error with TRACE level", () => {
            const error = new Error("Trace error");
            const logLine = new LogLine(LogLevel.TRACE, "Trace message", new Date(), [error]);
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.trace).toHaveBeenCalledWith("Trace message", error);
        });

        test("should display error with DEBUG level", () => {
            const error = new Error("Debug error");
            const logLine = new LogLine(LogLevel.DEBUG, "Debug message", new Date(), [error]);
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.debug).toHaveBeenCalledWith("Debug message", error);
        });

        test("should display error with INFO level", () => {
            const error = new Error("Info error");
            const logLine = new LogLine(LogLevel.INFO, "Info message", new Date(), [error]);
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.info).toHaveBeenCalledWith("Info message", error);
        });

        test("should display error with WARN level", () => {
            const error = new Error("Warn error");
            const logLine = new LogLine(LogLevel.WARN, "Warn message", new Date(), [error]);
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.warn).toHaveBeenCalledWith("Warn message", error);
        });

        test("should display error with ERROR level", () => {
            const error = new Error("Error message");
            const logLine = new LogLine(LogLevel.ERROR, "Error occurred", new Date(), [error]);
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.error).toHaveBeenCalledWith("Error occurred", error);
        });
    });

    describe("Without error object", () => {
        test("should display message without error for TRACE", () => {
            const logLine = new LogLine(LogLevel.TRACE, "Trace message", new Date());
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.trace).toHaveBeenCalledWith("Trace message");
        });

        test("should display message without error for DEBUG", () => {
            const logLine = new LogLine(LogLevel.DEBUG, "Debug message", new Date());
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.debug).toHaveBeenCalledWith("Debug message");
        });

        test("should display message without error for INFO", () => {
            const logLine = new LogLine(LogLevel.INFO, "Info message", new Date());
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.info).toHaveBeenCalledWith("Info message");
        });

        test("should display message without error for WARN", () => {
            const logLine = new LogLine(LogLevel.WARN, "Warn message", new Date());
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.warn).toHaveBeenCalledWith("Warn message");
        });

        test("should display message without error for ERROR", () => {
            const logLine = new LogLine(LogLevel.ERROR, "Error message", new Date());
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.error).toHaveBeenCalledWith("Error message");
        });
    });

    describe("Different error types", () => {
        test("should handle TypeError", () => {
            const error = new TypeError("Type error");
            const logLine = new LogLine(LogLevel.ERROR, "Type error occurred", new Date(), [error]);
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.error).toHaveBeenCalledWith("Type error occurred", error);
        });

        test("should handle RangeError", () => {
            const error = new RangeError("Range error");
            const logLine = new LogLine(LogLevel.ERROR, "Range error occurred", new Date(), [error]);
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.error).toHaveBeenCalledWith("Range error occurred", error);
        });

        test("should handle custom error with stack trace", () => {
            const error = new Error("Custom error");
            error.stack = "Custom stack trace";
            const logLine = new LogLine(LogLevel.ERROR, "Custom error occurred", new Date(), [error]);
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.error).toHaveBeenCalledWith("Custom error occurred", error);
        });
    });

    describe("NONE level handling", () => {
        test("should not call any console method for NONE level", () => {
            const error = new Error("Should not be displayed");
            const logLine = new LogLine(LogLevel.NONE, "None message", new Date(), [error]);
            
            consoleLogAppender.append(logLine);
            
            expect(consoleSpy.trace).not.toHaveBeenCalled();
            expect(consoleSpy.debug).not.toHaveBeenCalled();
            expect(consoleSpy.info).not.toHaveBeenCalled();
            expect(consoleSpy.warn).not.toHaveBeenCalled();
            expect(consoleSpy.error).not.toHaveBeenCalled();
        });
    });

    describe("Formatter integration", () => {
        test("should use formatter for message text", () => {
            const mockFormatter = {
                format: jest.fn().mockReturnValue("Formatted message")
            };
            const appender = new ConsoleLogAppender(mockFormatter);
            
            const error = new Error("Test error");
            const logLine = new LogLine(LogLevel.INFO, "Original message", new Date(), [error]);
            
            appender.append(logLine);
            
            expect(mockFormatter.format).toHaveBeenCalledWith(logLine);
            expect(consoleSpy.info).toHaveBeenCalledWith("Formatted message", error);
        });

        test("should handle formatter without error object", () => {
            const mockFormatter = {
                format: jest.fn().mockReturnValue("Formatted message")
            };
            const appender = new ConsoleLogAppender(mockFormatter);
            
            const logLine = new LogLine(LogLevel.WARN, "Original message", new Date());
            
            appender.append(logLine);
            
            expect(mockFormatter.format).toHaveBeenCalledWith(logLine);
            expect(consoleSpy.warn).toHaveBeenCalledWith("Formatted message");
        });
    });

    describe("Flush method", () => {
        test("should not throw when flush is called", () => {
            expect(() => consoleLogAppender.flush()).not.toThrow();
        });
    });
});