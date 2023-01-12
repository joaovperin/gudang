import { LogLine } from "..";
import LogFormatter from "../interfaces/log-formatter";

/**
 * Raw log formatter.
 *
 * This formatter will return the log line text without any formatting.
 * This is useful if you want to use your own formatter.
 */
export default class RawLogFormatter implements LogFormatter {

    /**
     * Format a log line as a string
     *
     * @param line
     */
    format(line: LogLine): string {
        return line.text;
    }

}