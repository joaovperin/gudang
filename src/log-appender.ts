import LogLine from "./log-line";

/**
 * Interface for Log appenders
 */
export default interface LogAppender {

    /**
     * Append a line to the appender
     *
     * @param line
     */
    append(line: LogLine): void;

}