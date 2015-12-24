// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import * as taskRunner from './taskrunner';
import * as taskNameParser from './tasknameparser';
import * as rnxJsonLoader from './rnxjsonloader';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var disposable = vscode.commands.registerCommand('extension.rnx', () => {
    
        if (vscode.workspace.rootPath === null)
        {
            return;
        }
        
        var rnxConfig;
        
        rnxJsonLoader.loadRnxJson().then(cfg => 
        {
            rnxConfig = cfg; // save for later
            return getFileNames(rnxConfig);
        })
        .then(taskNameParser.parseTaskNames)
        .then(tasks =>  
        {
            handleAvailableTasks(rnxConfig, tasks);
        });
	});
    
	context.subscriptions.push(disposable);
}

function handleAvailableTasks(rnxConfig, tasks: any[])
{
    if(tasks.length == 0)
    {
        vscode.window.showErrorMessage("No rnx tasks found");
    }
    else
    {
        vscode.window.showQuickPick(tasks).then(value=> {
            if(value)
            {
                var args = rnxConfig && rnxConfig.args ? rnxConfig.args : "";
                taskRunner.runTask(value.label, args);
            }
        });
    }
}

// get all source code files that contain tasks
// if no rnx.json file is found, we expect a "rnx.cs" file
function getFileNames(rnxConfig)
{
    var csFileGlobPatterns: string[] = [];
       
    if(rnxConfig && rnxConfig.sources)
    {
        for(var i in rnxConfig.sources)
        {
            csFileGlobPatterns.push(rnxConfig.sources[i]);
        }
    }
    else
    {
        csFileGlobPatterns.push("rnx.cs");    
    }
    
    return csFileGlobPatterns;
}

// this method is called when your extension is deactivated
export function deactivate() {
}