import LogAppender from "../log-appender";
import LogLine from "../log-line";
import LogLevel from "../log-level";

/**
 * Console log appender
 */
export default class ConsoleLogAppender implements LogAppender {

    /**
     * Append a line to the appender
     *
     * @param line
     */
    append(line: LogLine): void {
        const { level, text } = line;
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
     * Flush the lines to disk (or wherever you want to)
     */
    flush(): void {
        // Console doesn't need to flush
    }

}