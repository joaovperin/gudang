import { DefaultLogFormatter, LogFormatter } from "..";
import LogLevel from "../log-level";
import LogLine from "../log-line";
import AbstractLogAppender from "./abstract-log-appender";

/**
 * Console log appender
 */
export default class ConsoleLogAppender extends AbstractLogAppender {

    constructor (formatter: LogFormatter = new DefaultLogFormatter()) {
        super(formatter);
    }

    /**
     * Append a line to the appender
     *
     * @param line
     */
    append(line: LogLine): void {
        const text = this.formatter.format(line);
        const { level, error } = line;
        switch (level) {
            case LogLevel.TRACE:
                console.trace(text, error || '');
                break;
            case LogLevel.DEBUG:
                console.debug(text, error || '');
                break;
            case LogLevel.INFO:
                console.info(text, error || '');
                break;
            case LogLevel.WARN:
                console.warn(text, error || '');
                break;
            case LogLevel.ERROR:
                console.error(text, error || '');
                break;
            case LogLevel.NONE:
                break;
        }
    }

    /**
     * Console isn't flushable
     */
    flush(): void { }

}