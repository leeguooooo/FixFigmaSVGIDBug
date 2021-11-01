import * as vscode from 'vscode';

const idPattern = /id=".+:[0-9]+"/g;
const urlPattern = /\(#.+:.+\)/g;

const fixBug = () => {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		let word = document.getText();
		const ids = idPattern.test(word) ? word.match(idPattern) : [];
		const urls = urlPattern.test(word) ? word.match(urlPattern) : [];
		[...ids!, ...urls!].forEach((text:any)=>{
			word = word.replace(text, text.replace(':', '_'));
		});
		const r = new vscode.Range(new vscode.Position(0,0), new vscode.Position(document.lineCount, 1));

		editor.edit(editBuilder => {
			editBuilder.replace(r, word);
		});
	}
		vscode.window.showInformationMessage('SVG ID 中的冒号已成功替换!');
}

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand('fixFigmaSVGIDBug.fix', fixBug);

	  context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(fixBug));

    context.subscriptions.push(disposable);
}
