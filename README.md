# GudangJS

A simple and lightweight javascript Log service.

### How to get started?

Just import Log class, add some appenders at the start of your application, and then use it freely :)
```typescript
    Log.info('Just saying that everything is going well :)');

    Log.warn('Something bad happened, but we handled well with that :D');

    Log.error('Hey, something bad happened :/');
```

#### Set Global LOG Level :
```typescript
// Set log level to ERROR (only errors will be logged)
Log.level = LogLevel.ERROR;

Log.debug('This will not be logged');
Log.warn('This will not be logged too');
Log.error('This will be.');
```

#### Create custom formatters :
```typescript
class JhonDoeFormatter implements LogFormatter {

    format(line: LogLine): string {
        return `Jhon Doe said: '${line.text}' When? At ${line.timestamp.toLocaleDateString()}. It was a ${line.level}.`
    }

}
// Don't forget to register the appender!
Log.setAppenders(new ConsoleLogAppender(new JhonDoeFormatter()));
```

#### Use Filesystem log appenders :
```typescript
Log.addAppender(new FileSystemLogAppender('/var/log/my_app_log.log'));

// Create a rotating log on the file system
Log.setAppenders([
    new RotatingFileSystemLogAppender('/tmp/', 'system_logs')
]);

Log.error('This will be logged on the file system, in a file called system_logs_YYYY-MM-DD.txt');
```

#### Create custom appenders:
```typescript
class JohnDoeAppender extends AbstractLogAppender {

    append(line: LogLine): void {
       console.log(`Jhon Doe said: '${line.text}'`);
    }

}
// Don't forget to add that to the logger!
Log.addAppender(new JohnDoeAppender());
```

#### Use multiple appenders :
```typescript
Log.setAppenders([
    new ConsoleLogAppender(),
    new FileSystemLogAppender('/tmp/my_log.txt')
]);
```

Feel free to request for improvements or open issues for bugs :D
