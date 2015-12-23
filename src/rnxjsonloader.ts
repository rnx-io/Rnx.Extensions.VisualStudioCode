import * as vscode from 'vscode';
import * as fs from 'fs'; 

export function loadRnxJson()
{
    return vscode.workspace.findFiles("rnx.json", "", 1).then(filenames =>
    {
        if(filenames.length > 0)
        {
            var jsonContent = fs.readFileSync(filenames.pop().fsPath, 'utf8')
            return JSON.parse(jsonContent);
        }
        
        return null; 
    });
}