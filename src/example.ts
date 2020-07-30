import { ConsoleLogAppender, FileSystemLogAppender, Log } from ".";

Log.setAppenders([
    new ConsoleLogAppender(),
    new FileSystemLogAppender('tmp/my_log.txt')
]);

Log.info('Just saying that everything is going well :)');

Log.warn('Something bad happened, but we handled well with that :D');

Log.error('Hey, something bad happened :/');

Log.flush();