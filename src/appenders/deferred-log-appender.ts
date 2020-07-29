import LogAppender from "../log-appender";
import LogLine from "../log-line";

/**
 * Deferred log appender
 *
 * It will buffer all the lines and process when you manually call flush.
 *
 * The flush function needs to be implemented.
 */
export default abstract class DeferredLogAppender implements LogAppender {

    /** Logged lines */
    private lines: LogLine[] = [];

    /**
     * Append a line to the appender
     *
     * @param line
     */
    append(line: LogLine): void {
        this.lines.push(line);
    }

    /**
     * Flush the lines to disk (or wherever you want to)
     */
    abstract flush(): void;

}