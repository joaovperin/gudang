import LogLevel from "./log-level";

/**
 * A Log line
 */
export default class LogLine {

    /** Level */
    level: LogLevel;
    /** Text */
    text: string;
    /** Timestamp */
    timestamp: Date;
    /** Error object if provided */
    error?: Error;

    constructor (level: LogLevel, text: string, timestamp: Date, error?: Error) {
        this.text = text;
        this.level = level;
        this.timestamp = timestamp;
        this.error = error;
    }

}