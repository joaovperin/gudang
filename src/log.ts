import { ConsoleLogAppender } from ".";
import LogAppender from "./interfaces/log-appender";
import LogLevel from "./log-level";
import LogLine from "./log-line";

/**
 * Log main class.
 * This class is a singleton, so you can't instantiate it.
 * You can use the static methods to log lines.
 * You can also set the global log level.
 *
 * The global log level is used to filter the lines that will be logged.
 *
 * If the level is set to TRACE, all lines will be logged.
 * If the level is set to DEBUG, only DEBUG, INFO, WARN and ERROR lines will be logged.
 * If the level is set to INFO, only INFO, WARN and ERROR lines will be logged.
 * If the level is set to WARN, only WARN and ERROR lines will be logged.
 * If the level is set to ERROR, only ERROR lines will be logged.
 * If the level is set to NONE, no lines will be logged.
 *
 * You can also set the appenders to the log singleton.
 * The appenders are the classes that will process the lines.
 * You can set multiple appenders.
 * The default appender is the ConsoleLogAppender.
 * You can also create your own appenders by implementing the LogAppender interface.
 *
 */
export default class Log {

    /** Singleton instance */
    private static readonly _instance = new Log();
    /** Appenders */
    private appenders: LogAppender[];
    /** Global LOG Level */
    private _level: LogLevel = LogLevel.INFO;

    /**
     * Gets the global log level. If the level is set to INFO, only INFO, WARN and ERROR lines will be logged.
     * If the level is set to WARN, only WARN and ERROR lines will be logged.
     * If the level is set to ERROR, only ERROR lines will be logged.
     * If the level is set to NONE, no lines will be logged.
     */
    public static get level(): LogLevel { return Log._instance._level };

    /**
     * Sets the global log level. If the level is set to INFO, only INFO, WARN and ERROR lines will be logged.
     *
     * If the level is set to WARN, only WARN and ERROR lines will be logged.
     * If the level is set to ERROR, only ERROR lines will be logged.
     * If the level is set to NONE, no lines will be logged.
     */
    public static set level(level: LogLevel) { Log._instance._level = level };

    private constructor () {
        this.appenders = [];
    }

    /**
     * Sets the log appenders to the log singleton
     */
    static setAppenders(appenders: LogAppender[]): void {
        Log._instance.appenders = appenders;
    }

    /**
     * Adds an appender to the log singleton
     */
    static addAppender(appender: LogAppender): void {
        Log._instance.appenders.push(appender);
    }

    /**
     * Flush all the appenders
     */
    static flush(): void {
        Log._instance.appenders.forEach(e => e.flush());
    }

    /**
     * Register a TRACE line
     *
     * @param message Template string with {} placeholders
     * @param args Arguments to substitute in the message, last argument can be an Error
     */
    static trace(message: string, ...args: any[]): void {
        if (Log.isEnabled(LogLevel.TRACE)) {
            return Log.log(message, LogLevel.TRACE, ...args);
        }
    }

    /**
     * Register a DEBUG line
     *
     * @param message Template string with {} placeholders
     * @param args Arguments to substitute in the message, last argument can be an Error
     */
    static debug(message: string, ...args: any[]): void {
        if (Log.isEnabled(LogLevel.DEBUG)) {
            return Log.log(message, LogLevel.DEBUG, ...args);
        }
    }

    /**
     * Register an INFO line
     *
     * @param message Template string with {} placeholders
     * @param args Arguments to substitute in the message, last argument can be an Error
     */
    static info(message: string, ...args: any[]): void {
        if (Log.isEnabled(LogLevel.INFO)) {
            return Log.log(message, LogLevel.INFO, ...args);
        }
    }

    /**
     * Register a WARN line
     *
     * @param message Template string with {} placeholders
     * @param args Arguments to substitute in the message, last argument can be an Error
     */
    static warn(message: string, ...args: any[]): void {
        if (Log.isEnabled(LogLevel.WARN)) {
            return Log.log(message, LogLevel.WARN, ...args);
        }
    }

    /**
     * Register an ERROR line
     *
     * @param message Template string with {} placeholders
     * @param args Arguments to substitute in the message, last argument can be an Error
     */
    static error(message: string, ...args: any[]): void {
        if (Log.isEnabled(LogLevel.ERROR)) {
            return Log.log(message, LogLevel.ERROR, ...args);
        }
    }

    /**
     * Register a line to be processed by the appenders
     *
     * @param message Template string with {} placeholders
     * @param level Log level
     * @param args Arguments to substitute in the message, last argument can be an Error
     */
    private static log(message: string, level: LogLevel, ...args: any[]): void {
        // Defaults with a console log appender if no one was provided
        if (!Log._instance.appenders.length) {
            Log._instance.appenders.push(new ConsoleLogAppender());
        }

        // Separate error from other arguments
        let error: Error | undefined;
        let substitutionArgs = args;
        
        if (args.length > 0 && args[args.length - 1] instanceof Error) {
            error = args[args.length - 1];
            substitutionArgs = args.slice(0, -1);
        }

        // Perform string substitution
        let formattedMessage = message;
        let argIndex = 0;
        formattedMessage = formattedMessage.replace(/\{\}/g, () => {
            if (argIndex < substitutionArgs.length) {
                const arg = substitutionArgs[argIndex++];
                return String(arg);
            }
            return '{}';
        });

        const line = new LogLine(level, formattedMessage, new Date(), error);
        Log._instance.appenders.forEach(e => e.append(line));
    }

    /**
     * Check if level is enabled
     * 
     * @param level
     */
    private static isEnabled(level: LogLevel): boolean {
        const logLevels = [LogLevel.TRACE, LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        return logLevels.indexOf(level) >= logLevels.indexOf(Log.level);
    }

}