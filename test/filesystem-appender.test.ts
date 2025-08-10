import fs from 'fs';
import path from 'path';
import { FileSystemLogAppender, RotatingFileSystemLogAppender, RawLogFormatter } from "../src";
import { LogLevel, LogLine } from "../src";

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

describe("FileSystem Appenders Error Handling", () => {
    let mockWriteStream: {
        write: jest.Mock;
        end: jest.Mock;
    };
    let originalDate: DateConstructor;

    beforeEach(() => {
        mockWriteStream = {
            write: jest.fn(),
            end: jest.fn()
        };

        mockFs.createWriteStream.mockReturnValue(mockWriteStream as any);
        originalDate = global.Date;
        jest.clearAllMocks();
    });

    afterEach(() => {
        global.Date = originalDate;
    });

    describe("FileSystemLogAppender", () => {
        let appender: FileSystemLogAppender;

        beforeEach(() => {
            appender = new FileSystemLogAppender('/tmp/test.log', new RawLogFormatter());
        });

        test("should write log message without error", () => {
            const logLine = new LogLine(LogLevel.INFO, "Test message", new Date());

            appender.append(logLine);

            expect(mockFs.createWriteStream).toHaveBeenCalledWith('/tmp/test.log', { flags: 'a' });
            expect(mockWriteStream.write).toHaveBeenCalledWith("Test message\n");
        });

        test("should write log message with error details", () => {
            const error = new Error("Test error");
            error.stack = "Error: Test error\n    at test.js:1:1";
            const logLine = new LogLine(LogLevel.ERROR, "Something failed", new Date(), error);

            appender.append(logLine);

            const expectedOutput = "Something failed\nError: Test error\nStack: Error: Test error\n    at test.js:1:1\n";
            expect(mockWriteStream.write).toHaveBeenCalledWith(expectedOutput);
        });

        test("should write error without stack trace", () => {
            const error = new Error("Simple error");
            delete error.stack; // Remove stack trace
            const logLine = new LogLine(LogLevel.WARN, "Warning occurred", new Date(), error);

            appender.append(logLine);

            const expectedOutput = "Warning occurred\nError: Simple error\n";
            expect(mockWriteStream.write).toHaveBeenCalledWith(expectedOutput);
        });

        test("should handle TypeError with stack", () => {
            const error = new TypeError("Type error occurred");
            error.stack = "TypeError: Type error occurred\n    at Object.<anonymous>";
            const logLine = new LogLine(LogLevel.ERROR, "Type check failed", new Date(), error);

            appender.append(logLine);

            const expectedOutput = "Type check failed\nError: Type error occurred\nStack: TypeError: Type error occurred\n    at Object.<anonymous>\n";
            expect(mockWriteStream.write).toHaveBeenCalledWith(expectedOutput);
        });

        test("should reuse existing stream for multiple writes", () => {
            const logLine1 = new LogLine(LogLevel.INFO, "First message", new Date());
            const logLine2 = new LogLine(LogLevel.ERROR, "Second message", new Date(), new Error("Error 2"));

            appender.append(logLine1);
            appender.append(logLine2);

            expect(mockFs.createWriteStream).toHaveBeenCalledTimes(1);
            expect(mockWriteStream.write).toHaveBeenCalledTimes(2);
        });

        test("should flush and close stream", () => {
            const logLine = new LogLine(LogLevel.INFO, "Test message", new Date());
            appender.append(logLine);

            appender.flush();

            expect(mockWriteStream.end).toHaveBeenCalled();
        });
    });

    describe("RotatingFileSystemLogAppender", () => {
        let appender: RotatingFileSystemLogAppender;

        beforeEach(() => {
            // Mock path.join
            jest.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test("should create file with date format", () => {
            const mockDate = new Date('2023-05-15T12:00:00.000Z');
            global.Date = jest.fn(() => mockDate) as any;
            global.Date.now = originalDate.now;

            appender = new RotatingFileSystemLogAppender('/tmp', 'app-logs', new RawLogFormatter());
            const logLine = new LogLine(LogLevel.INFO, "Test message", new originalDate('2023-05-15'));

            appender.append(logLine);

            expect(path.join).toHaveBeenCalledWith('/tmp', 'app-logs-2023-5-15.log');
            expect(mockFs.createWriteStream).toHaveBeenCalledWith('/tmp/app-logs-2023-5-15.log', { flags: 'a' });
        });

        test("should write log with error to rotating file", () => {
            appender = new RotatingFileSystemLogAppender('/tmp', 'app-logs', new RawLogFormatter());
            const error = new Error("Rotating error");
            error.stack = "Error: Rotating error\n    at rotate.js:10:5";
            const logLine = new LogLine(LogLevel.ERROR, "Rotation failed", new originalDate(), error);

            appender.append(logLine);

            const expectedOutput = "Rotation failed\nError: Rotating error\nStack: Error: Rotating error\n    at rotate.js:10:5\n";
            expect(mockWriteStream.write).toHaveBeenCalledWith(expectedOutput);
        });

        test("should write simple message to rotating file", () => {
            appender = new RotatingFileSystemLogAppender('/tmp', 'app-logs', new RawLogFormatter());
            const logLine = new LogLine(LogLevel.DEBUG, "Debug message", new originalDate());

            appender.append(logLine);

            expect(mockWriteStream.write).toHaveBeenCalledWith("Debug message\n");
        });

        test("should handle custom error types", () => {
            appender = new RotatingFileSystemLogAppender('/tmp', 'app-logs', new RawLogFormatter());
            class CustomError extends Error {
                constructor(message: string, public code: string) {
                    super(message);
                    this.name = "CustomError";
                }
            }

            const error = new CustomError("Custom error occurred", "ERR_CUSTOM");
            error.stack = "CustomError: Custom error occurred\n    at custom.js:5:10";
            const logLine = new LogLine(LogLevel.ERROR, "Custom error detected", new originalDate(), error);

            appender.append(logLine);

            const expectedOutput = "Custom error detected\nError: Custom error occurred\nStack: CustomError: Custom error occurred\n    at custom.js:5:10\n";
            expect(mockWriteStream.write).toHaveBeenCalledWith(expectedOutput);
        });
    });

    describe("Integration with formatters", () => {
        test("should work with default formatter and errors", () => {
            const appender = new FileSystemLogAppender('/tmp/formatted.log'); // Uses DefaultLogFormatter
            const error = new Error("Formatted error");
            const logLine = new LogLine(LogLevel.WARN, "Warning message", new originalDate('2023-01-01T12:00:00.000Z'), error);

            appender.append(logLine);

            // Should contain formatted message plus error details
            const writeCall = mockWriteStream.write.mock.calls[0][0];
            expect(writeCall).toContain("Warning message");
            expect(writeCall).toContain("Error: Formatted error");
            expect(writeCall).toMatch(/\[warn\]/); // Default formatter adds level
        });

        test("should handle empty error message", () => {
            const appender = new FileSystemLogAppender('/tmp/test.log', new RawLogFormatter());
            const error = new Error("");
            const logLine = new LogLine(LogLevel.ERROR, "Empty error", new originalDate(), error);

            appender.append(logLine);

            // Even empty error messages have stack traces, so we need to check for both parts
            const writeCall = mockWriteStream.write.mock.calls[0][0];
            expect(writeCall).toContain("Empty error");
            expect(writeCall).toContain("Error: ");
            expect(writeCall).toContain("Stack: ");
        });
    });
});