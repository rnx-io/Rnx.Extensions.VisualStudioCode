'use strict';

import {workspace} from 'vscode';
import {readFileSync} from 'fs';
import {TaskInfo} from '../abstractions/taskInfo';
import {removeComments} from '../util/csCommentStripper';

const regex = new RegExp("public\\s+.*?ITaskDescriptor\\s+(\\w+)", "g");

export function parseTaskNames() : Promise<TaskInfo[]> {
    let promises: Set<Thenable<void>> = new Set<Thenable<void>>();
    let tasks: Set<TaskInfo> = new Set<TaskInfo>();
    let workingDirectory = workspace.rootPath;
    
    for(let pattern of getRnxFilePathPatterns()) {
        let promise = workspace.findFiles(pattern, "").then(filenames => {
            for(let filename of filenames) {
                let data = readFileSync(filename.fsPath, 'utf8');

                // remove comments to avoid showing ITaskDescriptor-properties or -methods
                // that are commented out
                data = removeComments(data);
                let match;

                while(match = regex.exec(data)) {
                    tasks.add(new TaskInfo(match[1], `Runs the '${match[1]}' task`));
                }
            }
        });
        
        promises.add(promise)
    }
    
    return Promise.all(Array.from(promises)).then(() => { 
        return Array.from(tasks);                         
    });                                                   
}

// get all source code files that contain tasks
function getRnxFilePathPatterns() : Iterable<string> {
    let csFileGlobPatterns: Set<string> = new Set<string>();
    let cmdArgs = workspace.getConfiguration("rnx").get<string>("commandLineArgs");
    
    if(cmdArgs) {
        let args = splitCommandLine(cmdArgs);
        let found = false;
        
        for(let arg of args) {
            if(arg === "-f" || arg === "--rnx-file") {
                found = true;
            }
            else if(found) {
                if(arg.startsWith("-")) {
                    break;
                }
                else {
                    csFileGlobPatterns.add(arg);
                }
            }
        }
    }
    
    if(csFileGlobPatterns.size == 0) {
        csFileGlobPatterns.add("rnx.cs");    
    }
    
    return csFileGlobPatterns;
}

function splitCommandLine(commandLine: string) : string[] {
    let output = "";
    let escaped = false;

    for (let i = 0; i < commandLine.length; i++) {
        if (commandLine[i] == '"') {
            escaped = !escaped;
        }
        else if (commandLine[i] == ' ' && !escaped) {
            output += '\n';
        }
        else {
            output += commandLine[i];    
        }
    }

    return output.split("\n").filter(f => f.trim().length > 0);
}