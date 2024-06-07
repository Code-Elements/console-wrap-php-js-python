(function () {
	'use strict';

	const vscode = require("vscode");

	const insertText = (editor, text) => {

		const selection = editor.selection;

		const range = new vscode.Range(selection.start, selection.end);

		editor.edit((editBuilder) => {
			editBuilder.replace(range, text);
		});

	};

	function activate(context) {
		let disposable = vscode.commands.registerCommand('console-wrap-php-js-python.log', () => {

			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				return;
			}

			const selection = editor.selection;

			if (selection.isSingleLine === true) {

				let range;

				if (selection.isEmpty === true) {

					const position = new vscode.Position(selection.start.line, selection.start.character);

					range = editor.document.getWordRangeAtPosition(position);

					if (range == undefined) {
						return;
					}

				} else {
					range = selection;
				}

				const text = editor.document.getText(range);

				if (editor.document.languageId === 'javascript' || editor.document.languageId === 'typescript') {
					vscode.commands.executeCommand('editor.action.insertLineAfter').then(() => {
						const logToInsert = `console.log("${text}: ", ${text});`;
						insertText(editor, logToInsert);
					});
				}

				if (editor.document.languageId === 'php') {
					vscode.commands.executeCommand('editor.action.insertLineAfter').then(() => {
						const logToInsert = `echo '<pre>'; print_r(${text}); echo '</pre>';`;
						insertText(editor, logToInsert);
					});
				}

				if (editor.document.languageId === 'python') {
					vscode.commands.executeCommand('editor.action.insertLineAfter').then(() => {
						const logToInsert = `print("${text}", ${text})`;
						insertText(editor, logToInsert);
					});
				}
			}
		});
		context.subscriptions.push(disposable);
	}

	// this method is called when your extension is deactivated
	function deactivate() { }

	module.exports = {
		activate,
		deactivate
	};

}());