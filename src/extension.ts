import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface FileStat {
    name: string;
    modified: number;
}

let isLaravelProject: boolean = false;

function checkForLaravelProject() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        return false;
    }
    const storagePath = path.join(workspaceFolder.uri.fsPath, 'storage', 'logs');
    return fs.existsSync(storagePath);
}

function getFullPath(relativePath: string) {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        return "";
    }
    return path.join(workspaceFolder.uri.fsPath, relativePath);
}

function openLatestLog() {
    if (!isLaravelProject) {
        vscode.window.showErrorMessage("This is not a Laravel project.");
        return;
    }

    const logPath = 'storage/logs';
    const fullPath = getFullPath(logPath);
    if (!fs.existsSync(fullPath)) {
        vscode.window.showErrorMessage("Log path does not exist: " + fullPath);
        return;
    }

    // Get last edited file in log directory
    let fileStats: FileStat[] = [];
    fs.readdirSync(fullPath).forEach((file) => {
        const filePath = path.join(fullPath, file);
        fileStats.push({
            name: filePath,
            modified: fs.statSync(filePath).mtimeMs,
        });
    });
    if (fileStats.length === 0) {
        vscode.window.showErrorMessage("No log files found");
        return;
    }

    fileStats.sort((a, b) => b.modified - a.modified);

    // Open file in editor
    const latestLogFile = fileStats[0].name;
    vscode.workspace.openTextDocument(latestLogFile).then((doc) => {
        // Get last line that starts with the pattern [timestamp]
        const pattern = /^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]/;
        let lineNumber = 0;
        for (let i = doc.lineCount - 1; i >= 0; i--) {
            const line = doc.lineAt(i);
            if (pattern.test(line.text)) {
                lineNumber = i;
                break;
            }
        }

        // Open file and scroll to that line
        vscode.window.showTextDocument(doc).then((editor) => {
            const range = new vscode.Range(
                new vscode.Position(lineNumber, 0),
                new vscode.Position(lineNumber, 21) // 21 is the length of the timestamp
            );
            editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
            editor.selection = new vscode.Selection(range.start, range.end);
        });
    });
}

function addLogCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'php') {
        return;
    }

    const document = editor.document;
    const config = vscode.workspace.getConfiguration('laravelLogs');
    const logLevel = config.get('defaultLogLevel', 'info');

    const logLevels: { [key: string]: string } = {
        'info': "Log::info('This is an informational message.');",
        'warning': "Log::warning('This is a warning message.');",
        'error': "Log::error('This is an error message.');"
    };

    const logStatement = logLevels[logLevel];

    const fullText = document.getText();
    const useStatement = "use Illuminate\\Support\\Facades\\Log;";

    editor.edit(editBuilder => {
        if (!fullText.includes(useStatement)) {
            // Find the namespace line
            const lines = fullText.split('\n');
            let namespaceLineIndex = -1;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim().startsWith('namespace')) {
                    namespaceLineIndex = i;
                    break;
                }
            }

            if (namespaceLineIndex !== -1) {
                // Insert use statement after the namespace line
                const position = new vscode.Position(namespaceLineIndex + 1, 0);
                editBuilder.insert(position, '\n' + useStatement + '\n');
            } else {
                // If no namespace found, insert at the top of the file
                editBuilder.insert(new vscode.Position(0, 0), useStatement + '\n\n');
            }
        }

        // Insert log statement at cursor position
        const position = editor.selection.active;
        editBuilder.insert(position, logStatement + '\n');
    });
}

export function activate(context: vscode.ExtensionContext) {
    isLaravelProject = checkForLaravelProject();

    let openLatestLogDisposable = vscode.commands.registerCommand('laravelLogs.openLatestLog', openLatestLog);
    let addLogCodeDisposable = vscode.commands.registerCommand('laravelLogs.addLogCode', addLogCode);

    context.subscriptions.push(openLatestLogDisposable, addLogCodeDisposable);
}

export function deactivate() {}