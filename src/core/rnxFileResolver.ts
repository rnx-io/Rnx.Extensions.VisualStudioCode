'use strict';

import {workspace} from 'vscode';
import {splitCommandLine} from '../util/commandLineSplitter';
import * as path from 'path';

export function getRnxFile() : string {
    let cmdArgs = workspace.getConfiguration("rnx").get<string>("commandLineArgs");
    let rnxFilename = "rnx.cs";
    
    if(cmdArgs) {
        let args = splitCommandLine(cmdArgs);
        let found = false;
        
        for(let arg of args) {
            if(arg === "-f" || arg === "--filename") {
                found = true;
            }
            else if(found) {
                rnxFilename = arg;
                break;
            }
        }
    }
    
    return path.isAbsolute(rnxFilename) ? rnxFilename : path.join(workspace.rootPath, rnxFilename); 
}