'use strict';

import {workspace} from 'vscode';
import {splitCommandLine} from '../util/commandLineSplitter';

export function getRnxFileGlobs() : Iterable<string> {
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