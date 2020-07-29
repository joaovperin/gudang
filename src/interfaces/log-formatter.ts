import LogLine from "../log-line";

/**
 * Interface for Log formatters
 */
export default interface LogFormatter {

    /**
     * Format a log line as a string
     *
     * @param line
     */
    format(line: LogLine): string;

}