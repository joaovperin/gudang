import { ConsoleLogAppender, FileSystemLogAppender, Log, LogLevel, RotatingFileSystemLogAppender } from ".";

// Set appenders on the console and also the file system
Log.setAppenders([
    new ConsoleLogAppender(),
    new FileSystemLogAppender('tmp/my_log.txt')
]);

// Basic logging with string substitution
Log.info('Just saying that everything is going well :)');
Log.warn('Something bad happened, but we handled well with that :D');

// String substitution examples
const clientName = 'ClientA';
const userId = 12345;
const requestTime = 150;

Log.info('Client {} connected with user ID: {}', clientName, userId);
Log.debug('Request processed in {}ms for user {}', requestTime, userId);

// Error handling example
const error = new Error('Connection timeout');
Log.error('The client {} threw error: {}', clientName, error.message, error);

// Multiple placeholders with various types
const data = { count: 42, status: 'active' };
Log.info('Processing {} records with status: {} for client {}', data.count, data.status, clientName);

// Error without message substitution
Log.error('Database connection failed', new Error('Connection refused'));

// Flush method should be called to save on the file system. The console log appender doesn't need to be flushed.
Log.flush();

// Set log level to ERROR (only errors will be logged)
Log.level = LogLevel.ERROR;

Log.warn('This will not be logged: {}', 'hidden message');
Log.error('This will be logged with substitution: {}', 'error details');

// Create a rotating log on the file system
Log.setAppenders([
    new RotatingFileSystemLogAppender('/tmp/', 'system_logs')
]);

const timestamp = new Date().toISOString();
Log.error('System error at {}: {}', timestamp, 'Critical failure', new Error('System overload'));
