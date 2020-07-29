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

    /**
    * Flush the lines to disk (or wherever you want to)
    */
    flush(): void;

}