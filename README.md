# GudangJS

A simple and lightweight javascript Log service.

### How to get started?

Just import Log class, add some appenders at the start of your application, and then use it freely :)
```typescript
    Log.info('Just saying that everything is going well :)');

    Log.warn('Something bad happened, but we handled well with that :D');

    Log.error('Hey, something bad happened :/');
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

#### Filesystem log appender :
```typescript
Log.addAppender(new FileSystemLogAppender('/var/log/my_app_log.log'));
```

#### Create custom appenders:
```typescript
class JohnDoeAppender extends AbstractLogAppender {

    append(line: LogLine): void {
       console.log(`Jhon Doe said: '${line.text}'`);
    }

}
// Don't forget to add that to the logger!
Log.addAppender(new HttpLogAppender());
```