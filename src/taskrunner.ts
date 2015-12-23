import {exec} from 'child_process';
import * as vscode from 'vscode';
    
export function runTask(taskName:string, args:string)
{
    var commandLine = 'dnx -p "' + vscode.workspace.rootPath + '" rnx ' + taskName + " " + args;
    var cp = exec(commandLine, { cwd: vscode.workspace.rootPath });
    var outputTemp = "";
    var outputChannel = vscode.window.createOutputChannel("rnx");
    
    outputChannel.show(vscode.ViewColumn.Three);
    
    // read standard output and make sure that it will be logged linewise on the console
    cp.stdout.on('data', (d) =>
    {
        outputTemp += d;
        
        while(true)
        {
            var idx = outputTemp.indexOf("\n");
            
            if(idx >= 0)
            {
                var sub = outputTemp.substring(0, idx - 1);
                outputTemp = outputTemp.substring(idx + 1);
                
                if(sub.length > 0)
                {
                    outputChannel.appendLine(sub);
                }
            }
            else
            {
                break;
            }
        }
    });
}