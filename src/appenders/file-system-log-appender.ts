import fs, { WriteStream } from 'fs';
import { DefaultLogFormatter, LogFormatter } from "..";
import LogLine from "../log-line";
import AbstractLogAppender from "./abstract-log-appender";

/**
 * Filesystem log appender
 *
 * It will write logs to the filesystem
 */
export default class FileSystemLogAppender extends AbstractLogAppender {

    /** Path to write the logs */
    private logPath: string;
    /** Filepointer */
    private _stream: WriteStream;

    constructor (logPath: string, formatter: LogFormatter = new DefaultLogFormatter()) {
        super(formatter);
        this.logPath = logPath;
    }

    /**
     * Append a line to the appender
     *
     * @param line
     */
    append(line: LogLine): void {
        if (this._stream == null) {
            this._stream = fs.createWriteStream(this.logPath, { flags: 'a' });
        }
        // Write a line with objects if present
        let logOutput = this.formatter.format(line);
        if (line.objects.length > 0) {
            logOutput += '\nObjects:';
            line.objects.forEach((obj, index) => {
                if (obj instanceof Error) {
                    logOutput += `\n[${index}] Error: ${obj.message}`;
                    if (obj.stack) {
                        logOutput += `\nStack: ${obj.stack}`;
                    }
                } else {
                    logOutput += `\n[${index}] ${JSON.stringify(obj, null, 2)}`;
                }
            });
        }
        this._stream.write(`${logOutput}\n`);
    }

    /**
     * Flush the lines to disk
     */
    flush(): void {
        this._stream.end();
        this._stream = null;
    }

}