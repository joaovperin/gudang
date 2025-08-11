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
    /** Object values (non-primitives) for pretty printing */
    objects: any[];

    constructor (level: LogLevel, text: string, timestamp: Date, objects: any[] = []) {
        this.text = text;
        this.level = level;
        this.timestamp = timestamp;
        this.objects = objects;
    }

    /**
     * Get the first Error object from the objects array, if any
     */
    get error(): Error | undefined {
        return this.objects.find(obj => obj instanceof Error);
    }

}