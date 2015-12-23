import {workspace} from 'vscode';
import * as fs from 'fs';

const regex = new RegExp("public\\s+.*?ITaskDescriptor\\s+(\\w+)", "g");

export function parseTaskNames(csFileGlobPatterns:string[]){

    var promises = [];
    var tasks = [];
    
    csFileGlobPatterns.forEach(pattern => 
    {
        if(!pattern.startsWith("!"))
        {
            var promise = workspace.findFiles(pattern, "").then(filenames => 
            {
                for(var fIndex in filenames)
                {
                    var data = fs.readFileSync(filenames[fIndex].fsPath, 'utf8');
                    var match;
                    
                    while(match = regex.exec(data))
                    {
                        tasks.push({ description: "Runs the '" + match[1] + "' task",
                                           label: match[1] });
                    }
                }
            });
            
            promises.push(promise);
        }
    });

    return Promise.all(promises).then( () => 
    {
        return tasks;    
    });
}