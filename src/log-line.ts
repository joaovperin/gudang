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

    constructor (level: LogLevel, text: string, timestamp: Date) {
        this.text = text;
        this.level = level;
        this.timestamp = timestamp;
    }

}