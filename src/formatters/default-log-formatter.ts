import { LogLine } from "..";
import LogFormatter from "../interfaces/log-formatter";

/**
 * Default log formatter.
 * This is the default formatter used by the console appender.
 *
 * This formatter will return the log line text with the following format:
 * [LEVEL] TIMESTAMP: TEXT
 * Where:
 * - LEVEL is the log level
 * - TIMESTAMP is the log timestamp
 * - TEXT is the log text
 *
 * Example: [INFO] 2019-01-01T00:00:00.000Z: This is a log line
 */
export default class DefaultLogFormatter implements LogFormatter {

    /**
     * Format a log line as a string
     *
     * @param line
     */
    format(line: LogLine): string {
        return `[${line.level}] ${line.timestamp.toISOString()}: ${line.text}`;
    }

}