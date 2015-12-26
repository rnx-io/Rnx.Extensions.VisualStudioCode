'use strict';

import {workspace} from 'vscode';
import {readFileSync} from 'fs';

export function loadRnxJson() : any {
    return workspace.findFiles("rnx.json", "", 1).then(filenames => {
        if(filenames.length > 0) {
            let jsonContent = readFileSync(filenames[0].fsPath, 'utf8')
            return JSON.parse(jsonContent);
        }
        
        return undefined; 
    });
}