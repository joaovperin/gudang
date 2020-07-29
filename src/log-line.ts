import LogLevel from "./log-level";

/**
 * A Log line
 */
export default class LogLine {

    /** Text */
    text: string;
    /** Level */
    level: LogLevel;

    constructor (text: string, level: LogLevel) {
        this.text = text;
        this.level = level;
    }

}