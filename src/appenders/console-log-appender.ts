import LogLine from "../log-line";
import LogLevel from "../log-level";
import AbstractLogAppender from "./abstract-log-appender";

/**
 * Console log appender
 */
export default class ConsoleLogAppender extends AbstractLogAppender {

    /**
     * Append a line to the appender
     *
     * @param line
     */
    append(line: LogLine): void {
        const text = this.formatter.format(line);
        const { level } = line;
        switch (level) {
            case LogLevel.INFO:
                console.info(text);
                break;
            case LogLevel.WARN:
                console.warn(text);
                break;
            case LogLevel.ERROR:
                console.error(text);
                break;
        }
    }

    /**
     * Console isn't flushable
     */
    flush(): void { }

}