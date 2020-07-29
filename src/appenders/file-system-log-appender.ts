import LogAppender from "../interfaces/log-appender";
import LogLine from "../log-line";
import fs, { WriteStream } from 'fs';
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

    constructor (logPath: string) {
        super();
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
        // Write a line
        this._stream.write(`${this.formatter.format(line)}\n`);
    }

    /**
     * Flush the lines to disk
     */
    flush(): void {
        this._stream.end();
        this._stream = null;
    }

}