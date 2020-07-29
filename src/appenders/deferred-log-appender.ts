import LogLine from "../log-line";
import AbstractLogAppender from "./abstract-log-appender";

/**
 * Deferred log appender
 *
 * It will buffer all the lines and process when you manually call flush.
 *
 * The flush function needs to be implemented.
 */
export default abstract class DeferredLogAppender extends AbstractLogAppender {

    /** Logged lines */
    protected lines: LogLine[] = [];

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