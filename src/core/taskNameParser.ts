'use strict';

import {workspace} from 'vscode';
import * as fs from 'fs';
import {TaskInfo} from '../abstractions/taskInfo';
import {removeComments} from '../util/csCommentStripper';

const regex = new RegExp("public\\s+.*?ITaskDescriptor\\s+(\\w+)", "g");

export function parseTaskNames(csFileGlobPatterns:string[]) : Promise<TaskInfo[]> {
    let promises: Set<Thenable<void>> = new Set<Thenable<void>>(); 
    let tasks: Set<TaskInfo> = new Set<TaskInfo>();
    
    csFileGlobPatterns.forEach(pattern => {
        if(!pattern.startsWith("!")) {
            let promise = workspace.findFiles(pattern, "").then(filenames => {
                for(let filename of filenames) {
                    let data = fs.readFileSync(filename.fsPath, 'utf8');
                    
                    // remove comments to avoid showing ITaskDescriptor-properties or -methods
                    // that are commented out
                    data = removeComments(data);
                    let match;
                    
                    while(match = regex.exec(data)) {
                        tasks.add(new TaskInfo(match[1], "Runs the '" + match[1] + "' task"));
                    }
                }
            });
            
            promises.add(promise);
        }
    });

    return Promise.all(Array.from(promises)).then(() => {
        return Array.from(tasks);    
    });
}