import LogAppender from "../interfaces/log-appender";
import LogLine from "../log-line";
import LogFormatter from "../interfaces/log-formatter";
import DefaultLogFormatter from "../formatters/default-log-formatter";

/**
 * Abstract log appender
 */
export default abstract class AbstractLogAppender implements LogAppender {

    /** Line formatter */
    protected formatter: LogFormatter;

    constructor (formatter: LogFormatter = new DefaultLogFormatter()) {
        this.formatter = formatter;
    }

    /**
     * Sets the log appenders to the log singleton
     */
    setFormatter(formatter: LogFormatter): void {
        this.formatter = formatter;
    }

    /**
     * Append a line to the appender
     *
     * @param line
     */
    abstract append(line: LogLine): void;

    /**
    * Flush the lines to disk (or wherever you want to)
    */
    flush(): void { }

}