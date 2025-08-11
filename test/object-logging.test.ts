import * as gudangjs from "../src";
import { LogLevel, LogLine } from "../src";

const Log = gudangjs.Log as any;

describe("Object Logging", () => {
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

    describe("Object storage", () => {
        test("should store user objects for pretty printing", () => {
            const userObj = { id: 123, name: "John Doe", email: "john@example.com" };
            Log.info("User object for id {} is: ", userObj.id, userObj);
            
            expect(mockAppender.append).toHaveBeenCalledTimes(1);
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("User object for id 123 is: ");
            expect(logLine.objects).toContain(userObj);
            expect(logLine.objects).toHaveLength(1);
        });

        test("should store multiple objects", () => {
            const user = { id: 1, name: "Alice" };
            const config = { theme: "dark", notifications: true };
            const error = new Error("Something failed");
            
            Log.error("User {} with config {} encountered error", user.name, config.theme, user, config, error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("User Alice with config dark encountered error");
            expect(logLine.objects).toContain(user);
            expect(logLine.objects).toContain(config);
            expect(logLine.objects).toContain(error);
            expect(logLine.objects).toHaveLength(3);
            expect(logLine.error).toBe(error);
        });

        test("should handle arrays as objects", () => {
            const items = ["apple", "banana", "orange"];
            const user = { preferences: items };
            
            Log.debug("User {} has items: {}", user, items);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("User [object Object] has items: apple,banana,orange");
            expect(logLine.objects).toContain(user);
            expect(logLine.objects).toContain(items);
            expect(logLine.objects).toHaveLength(2);
        });

        test("should handle nested objects", () => {
            const user = {
                id: 123,
                profile: {
                    name: "John",
                    settings: {
                        theme: "dark",
                        lang: "en"
                    }
                },
                roles: ["admin", "user"]
            };
            
            Log.info("Complex user object: {}", user);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.objects).toContain(user);
            expect(logLine.objects).toHaveLength(1);
        });
    });

    describe("Primitive vs non-primitive separation", () => {
        test("should only store non-primitives as objects", () => {
            const obj = { key: "value" };
            Log.info("String: {}, Number: {}, Boolean: {}, Null: {}, Undefined: {}, Object: {}", 
                "test", 42, true, null, undefined, obj);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("String: test, Number: 42, Boolean: true, Null: null, Undefined: undefined, Object: [object Object]");
            expect(logLine.objects).toContain(obj);
            expect(logLine.objects).toHaveLength(1); // Only the object
        });

        test("should handle functions as objects", () => {
            const fn = () => "test function";
            const obj = { method: fn };
            
            Log.debug("Function: {}, Object with method: {}", fn, obj);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.objects).toContain(fn);
            expect(logLine.objects).toContain(obj);
            expect(logLine.objects).toHaveLength(2);
        });

        test("should handle Date objects", () => {
            const date = new Date("2023-01-01T12:00:00.000Z");
            const user = { createdAt: date };
            
            Log.info("User created at {}: {}", date, user);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.objects).toContain(date);
            expect(logLine.objects).toContain(user);
            expect(logLine.objects).toHaveLength(2);
        });
    });

    describe("Backwards compatibility", () => {
        test("should work with old-style error logging", () => {
            const error = new Error("Legacy error");
            Log.error("Legacy error occurred", error);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Legacy error occurred");
            expect(logLine.objects).toContain(error);
            expect(logLine.error).toBe(error);
        });

        test("should work with simple string logging", () => {
            Log.info("Simple message");
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Simple message");
            expect(logLine.objects).toHaveLength(0);
            expect(logLine.error).toBeUndefined();
        });

        test("should work with primitive substitution only", () => {
            Log.warn("Value: {}, Count: {}", "test", 42);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Value: test, Count: 42");
            expect(logLine.objects).toHaveLength(0);
        });
    });

    describe("Edge cases", () => {
        test("should handle empty objects", () => {
            const emptyObj = {};
            const emptyArray: any[] = [];
            
            Log.info("Empty object: {}, Empty array: {}", emptyObj, emptyArray);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.objects).toContain(emptyObj);
            expect(logLine.objects).toContain(emptyArray);
            expect(logLine.objects).toHaveLength(2);
        });

        test("should handle circular references", () => {
            const circular: any = { name: "circular" };
            circular.self = circular;
            
            Log.debug("Circular object: {}", circular);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.objects).toContain(circular);
            expect(logLine.objects).toHaveLength(1);
        });

        test("should handle symbols", () => {
            const sym = Symbol("test");
            Log.info("Symbol: {}", sym);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("Symbol: Symbol(test)");
            expect(logLine.objects).toHaveLength(0); // Symbols are primitives
        });

        test("should handle mixed primitive and object arguments", () => {
            const user = { name: "Alice" };
            const settings = { theme: "dark" };
            
            Log.info("User {} (ID: {}) has {} notifications and uses {} theme", 
                user.name, 123, 5, settings.theme, user, settings);
            
            const logLine: LogLine = mockAppender.append.mock.calls[0][0];
            expect(logLine.text).toBe("User Alice (ID: 123) has 5 notifications and uses dark theme");
            expect(logLine.objects).toContain(user);
            expect(logLine.objects).toContain(settings);
            expect(logLine.objects).toHaveLength(2);
        });
    });
});