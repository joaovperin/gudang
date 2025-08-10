# GudangJS - Project Understanding

## What GudangJS Does

GudangJS is a simple and lightweight JavaScript/TypeScript logging library designed for Node.js applications. It provides a flexible logging system with the following key features:

### Core Functionality
- **Singleton Logger**: Uses a singleton pattern for the main `Log` class
- **Multiple Log Levels**: TRACE, DEBUG, INFO, WARN, ERROR, and NONE
- **Configurable Appenders**: Multiple output destinations (console, file system, rotating files)
- **Custom Formatters**: Ability to create custom log formatting
- **Level Filtering**: Global log level controls which messages are logged

### Key Components
- **Log**: Main singleton class providing static logging methods (`src/log.ts:28`)
- **LogAppender**: Interface for output destinations (`src/interfaces/log-appender.ts`)
- **LogFormatter**: Interface for custom log formatting (`src/interfaces/log-formatter.ts`)
- **Appenders**: 
  - ConsoleLogAppender: Outputs to console
  - FileSystemLogAppender: Writes to files (`src/appenders/file-system-log-appender.ts:11`)
  - RotatingFileSystemLogAppender: Creates date-based rotating log files
  - DeferredLogAppender: Buffers logs for batch processing
- **Formatters**: DefaultLogFormatter and RawLogFormatter

### Usage Pattern
```typescript
// Set appenders
Log.setAppenders([new ConsoleLogAppender(), new FileSystemLogAppender('log.txt')]);

// Log messages
Log.info('Information message');
Log.error('Error message');

// Control log levels
Log.level = LogLevel.ERROR; // Only errors will be logged
```

## Known Limitations

### 1. Bug in TRACE Level Implementation
- **Issue**: `Log.trace()` method incorrectly logs at DEBUG level instead of TRACE (`src/log.ts:86`)
- **Impact**: TRACE messages appear as DEBUG level, affecting log filtering and formatting

### 2. File System Appender Issues
- **Stream Management**: FileSystemLogAppender creates streams on-demand but doesn't handle stream errors
- **Resource Leaks**: Potential for unclosed streams if flush() is not called properly
- **Concurrent Access**: No protection against concurrent writes to the same file

### 3. Test Coverage Gaps
- **Limited Tests**: Only basic level filtering is tested (`test/log.test.ts`)
- **Missing Tests**: No tests for appenders, formatters, or error conditions
- **Integration Tests**: No end-to-end testing of file operations

### 4. Error Handling
- **Silent Failures**: File system operations may fail silently
- **No Error Callbacks**: Appenders don't provide error handling mechanisms
- **Missing Validation**: No input validation for file paths or log messages

### 5. Performance Considerations
- **Synchronous Operations**: File operations are synchronous, potentially blocking
- **No Batching**: Each log call results in immediate I/O (except DeferredLogAppender)
- **Memory Usage**: No built-in log rotation size limits

### 6. API Design Limitations
- **Static-Only Interface**: All logging is done through static methods
- **Global State**: Single global log level affects all logging
- **No Logger Instances**: Cannot create separate loggers with different configurations

### 7. TypeScript/Build Issues
- **Typo in Scripts**: package.json has "prepare " with trailing space (`package.json:9`)
- **Outdated Dependencies**: Some dev dependencies may be outdated

## Development Commands
- **Build**: `npm run build` or `yarn build`
- **Test**: `npm test` or `yarn test` 
- **Example**: `npm start` or `yarn start`

## Architecture Notes
- Uses TypeScript with compilation to `dist/` directory
- Exports all components through `src/index.ts` barrel pattern
- Follows object-oriented design with interfaces and abstract classes
- Default appender (ConsoleLogAppender) is automatically added if no appenders are configured