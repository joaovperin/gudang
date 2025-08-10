import fs, { WriteStream } from 'fs';
import path from 'path';
import { DefaultLogFormatter, LogFormatter } from "..";
import LogLine from "../log-line";
import AbstractLogAppender from "./abstract-log-appender";

/**
 * Rotating Filesystem log appender
 *
 * It will write logs to the filesystem
 * This appender will create a new file for each day.
 * The file will be named with the following format: ${preffix}-YYYY-MM-DD.log
 * Where:
 * - YYYY is the year
 * - MM is the month
 * - DD is the day
 * Example: system_logs-2019-01-01.log
 *
 * The log file will be located in the path specified in the constructor.
 * The log file will be created if it does not exist.
 * The log file will be appended if it exists.
 * The log file will be flushed to disk every time a new line is appended.
 *
 */
export default class RotatingFileSystemLogAppender extends AbstractLogAppender {

    /** Path to write the logs */
    private logPath: string;
    /** Log filenames preffix */
    private name: string;
    /** Filepointer */
    private _stream: WriteStream;

    constructor (logPath: string, name: string, formatter: LogFormatter = new DefaultLogFormatter()) {
        super(formatter);
        this.logPath = logPath;
        this.name = name;
    }

    /**
     * Append a line to the appender
     *
     * @param line
     */
    append(line: LogLine): void {
        if (this._stream == null) {
            const today = new Date();
            const fileName = `${this.name}-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}.log`;
            const filePath = path.join(this.logPath, fileName);
            this._stream = fs.createWriteStream(filePath, { flags: 'a' });
        }
        // Write a line with error if present
        let logOutput = this.formatter.format(line);
        if (line.error) {
            logOutput += `\nError: ${line.error.message}`;
            if (line.error.stack) {
                logOutput += `\nStack: ${line.error.stack}`;
            }
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