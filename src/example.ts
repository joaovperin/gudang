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

// Object logging examples
const userObj = {
    id: userId,
    name: 'John Doe',
    email: 'john@example.com',
    preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
    },
    roles: ['user', 'admin']
};

Log.info('User object for id {} is: ', userId, userObj);

// Multiple objects with primitives
const sessionData = {
    sessionId: 'sess-12345',
    createdAt: new Date(),
    lastAccess: new Date(Date.now() - 3600000), // 1 hour ago
    isActive: true
};

const requestData = {
    method: 'POST',
    path: '/api/users',
    headers: { 'content-type': 'application/json' },
    body: { name: 'Alice', email: 'alice@test.com' }
};

Log.debug('Processing request {} for user {} with session data', requestData.path, userObj.name, userObj, sessionData, requestData);

// Error with context objects
const error = new Error('Connection timeout');
const connectionInfo = {
    host: 'database.example.com',
    port: 5432,
    database: 'prod',
    connectionPool: 'main'
};

Log.error('Database connection failed for user {}: {}', userObj.name, error.message, userObj, connectionInfo, error);

// Array logging
const items = ['apple', 'banana', 'cherry'];
const metadata = { source: 'api', version: '1.2.3' };

Log.info('Retrieved {} items from {}: {}', items.length, metadata.source, items, metadata);

// Flush method should be called to save on the file system. The console log appender doesn't need to be flushed.
Log.flush();

// Set log level to ERROR (only errors will be logged)
Log.level = LogLevel.ERROR;

const hiddenUser = { id: 999, name: 'Hidden' };
Log.warn('This will not be logged: {}', 'hidden message', hiddenUser); // Won't log due to level
Log.error('This will be logged with substitution: {}', 'error details');

// Create a rotating log on the file system
Log.setAppenders([
    new RotatingFileSystemLogAppender('/tmp/', 'system_logs')
]);

const systemState = {
    cpu: 85.2,
    memory: 78.1,
    disk: 45.0,
    processes: 142,
    uptime: '5 days, 12 hours'
};

const timestamp = new Date().toISOString();
Log.error('System error at {}: Critical failure', timestamp, systemState, new Error('System overload'));
