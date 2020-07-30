import LogLevel from "./log-level";
import LogLine from "./log-line";
import LogAppender from "./interfaces/log-appender";
import { DefaultLogFormatter, ConsoleLogAppender } from ".";

/**
 * Log main class
 */
export default class Log {

    /** Singleton instance */
    private static readonly _instance = new Log();
    /** Appenders */
    private appenders: LogAppender[];

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
     * Register an INFO line
     *
     * @param text
     */
    static info(text: string): void {
        return Log.log(text, LogLevel.INFO);
    }

    /**
     * Register an WARN line
     *
     * @param text
     */
    static warn(text: string): void {
        return Log.log(text, LogLevel.WARN);
    }

    /**
     * Register an ERROR line
     *
     * @param text
     */
    static error(text: string): void {
        return Log.log(text, LogLevel.ERROR);
    }

    /**
     * Register a line to be processed by the appenders
     *
     * @param text
     * @param level
     */
    private static log(text: string, level: LogLevel): void {
        // Defaults with a console log appender if no one was provided
        if (!Log._instance.appenders.length) {
            Log._instance.appenders.push(new ConsoleLogAppender());
        }
        const line = new LogLine(level, text, new Date());
        Log._instance.appenders.forEach(e => e.append(line));
    }

}