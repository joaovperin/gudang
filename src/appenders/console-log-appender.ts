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
        const { level, objects } = line;
        const args = objects.length > 0 ? [text, ...objects] : [text];
        
        switch (level) {
            case LogLevel.TRACE:
                console.trace(...args);
                break;
            case LogLevel.DEBUG:
                console.debug(...args);
                break;
            case LogLevel.INFO:
                console.info(...args);
                break;
            case LogLevel.WARN:
                console.warn(...args);
                break;
            case LogLevel.ERROR:
                console.error(...args);
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