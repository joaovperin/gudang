import LogFormatter from "../interfaces/log-formatter";
import { LogLine } from "..";

/**
 * Default log formatter
 */
export default class DefaultLogFormatter implements LogFormatter {

    /**
     * Format a log line as a string
     *
     * @param line
     */
    format(line: LogLine): string {
        return `[${line.level}] ${line.timestamp.toISOString()}: ${line.text}`
    }

}