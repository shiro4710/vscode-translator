// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as request from 'request';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-translator" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'vscode-translator.translate',
    async () => {
      // The code you place here will be executed every time your command is executed
      const fromLang = 'ja';
      const toLang = 'en';
      const source = await vscode.window.showInputBox({ value: 'Enter text' });
      const editor = vscode.window.activeTextEditor;
      if (source && editor) {
        const translated = await new Promise((resolve, reject) =>
          request(
            {
              url: `https://translate.googleapis.com/translate_a/single?client=it&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURI(
                source
              )}`,
              method: 'GET',
            },
            (error, response, body) => {
              if (error) {
                reject(error);
              }
              resolve(body);
            }
          )
        );
        const translatedStr = JSON.parse(String(translated))[0][0][0];
        if (translatedStr && translatedStr !== '') {
          editor.edit((editBuilder) => {
            editBuilder.insert(editor.selection.end, translatedStr);
          });
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
