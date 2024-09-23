# Laravel Logs

Laravel Logs is a Visual Studio Code extension designed to enhance the logging experience for Laravel developers. It provides quick access to log files and simplifies the process of adding log statements to your code.

## Features

1. **Open Latest Log**: Quickly open and view the most recent Laravel log file.
2. **Add Log Code**: Easily insert log statements into your PHP files.
3. **Configurable Log Level**: Set your preferred default log level for inserted log statements.

## Installation

1. Open Visual Studio Code
2. Press `Ctrl+P` (or `Cmd+P` on macOS) to open the Quick Open dialog
3. Type `ext install laravel-logs` and press Enter
4. Click the Install button to install the extension

## Usage

### Opening the Latest Log

There are four ways to open the latest log file:

1. Use the keyboard shortcut: `Ctrl+Shift+L` (or `Cmd+Shift+L` on macOS)
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`), then type and select "Laravel Logs: Open Latest Log"
3. Right-click anywhere in the editor and select "Laravel Logs: Open Latest Log" from the context menu
4. Click on the "Laravel Logs: Open Latest Log" option in the explorer view title menu

When opened, the log file will automatically scroll to the last line.

### Adding Log Code

To add a log statement to your PHP file:

1. Place your cursor where you want to insert the log statement
2. Use the keyboard shortcut: `Ctrl+Shift+I` (or `Cmd+Shift+I` on macOS)
3. Alternatively, right-click and select "Laravel Logs: Add Log Code" from the context menu (only available in PHP files)

The extension will automatically add the necessary `use` statement if it's not already present in the file.

## Configuration

You can configure the default log level used when inserting log statements:

1. Open VS Code settings (`Ctrl+,` or `Cmd+,`)
2. Search for "Laravel Logs"
3. Set the "Default Log Level" to your preferred level (info, warning, or error)

## Requirements

- This extension requires a Laravel project structure to function correctly.
- The project must have a `storage/logs` directory for log file access.

## Known Issues

- The extension currently only supports single-workspace environments.

## Release Notes

### 0.0.1

Initial release of Laravel Logs extension.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the [MIT License](LICENSE).