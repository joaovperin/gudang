import { ConsoleLogAppender, FileSystemLogAppender, Log, LogLevel, RotatingFileSystemLogAppender } from ".";

// Set appenders on the console and also the file system
Log.setAppenders([
    new ConsoleLogAppender(),
    new FileSystemLogAppender('tmp/my_log.txt')
]);

Log.info('Just saying that everything is going well :)');

Log.warn('Something bad happened, but we handled well with that :D');

Log.error('Hey, something bad happened :/');

// Flush method should be called to save on the file system. The console log appender doesn't need to be flushed.
Log.flush();

// Set log level to ERROR (only errors will be logged)
Log.level = LogLevel.ERROR;

Log.warn('This will not be logged');
Log.error('This will be.');

// Create a rotating log on the file system
Log.setAppenders([
    new RotatingFileSystemLogAppender('/tmp/', 'system_logs')
]);

Log.error('This will be logged on the file system, in a file called system_logs_YYYY-MM-DD.txt');
