'use strict';

import {window} from 'vscode';
import {readFileSync, existsSync} from 'fs';
import {TaskInfo} from '../abstractions/taskInfo';
import {removeComments} from '../util/csCommentStripper';
import {getRnxFile} from './rnxFileResolver';
import * as path from 'path';

const regex = new RegExp("public\\s+.*?ITaskDescriptor\\s+(\\w+)", "g");

export function parseTaskNames() : TaskInfo[] {
    let tasks: Set<TaskInfo> = new Set<TaskInfo>();

    parseTaskNamesInternal(getRnxFile(), tasks);
    
    return Array.from(tasks);                         
}

function parseTaskNamesInternal(filename: string, tasks: Set<TaskInfo>) {
    if(!existsSync(filename)) {
        return;
    }
    
    let data = readFileSync(filename, 'utf8').trim();
    let lines = data.split("\n");

    for(let line of lines) {
        line = line.trim();
        
        if(line.startsWith("//+")) {
            let fileToInclude = line.replace("//+", "").trim();
            
            // make absolute path
            fileToInclude = path.resolve(path.dirname(filename), fileToInclude); 
            parseTaskNamesInternal(fileToInclude, tasks);
        }
        else if(line.length > 0) {
            break;
        }
    }

    // remove comments to avoid showing ITaskDescriptor-properties or -methods
    // that are commented out
    data = removeComments(data);
    let match;

    while(match = regex.exec(data)) {
        tasks.add(new TaskInfo(match[1], `Runs the '${match[1]}' task`));
    }
}