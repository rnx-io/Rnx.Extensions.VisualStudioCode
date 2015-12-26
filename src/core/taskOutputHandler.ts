'use strict';

import {TaskLineOutputListener} from '../abstractions/taskOutputListener';

export class TaskOutputHandler {
    private tmpOutput: string = "";
    
    constructor(private taskLineOutputListeners: TaskLineOutputListener[]) {
    }
    
    public onData(data: string) : void {
        this.tmpOutput += data;
        
        while(true) {
            let idx = this.tmpOutput.indexOf("\n");
            
            if(idx >= 0) {
                let line = this.tmpOutput.substring(0, idx - 1);
                this.tmpOutput = this.tmpOutput.substring(idx + 1);
                
                if(line.length > 0) {
                    this.taskLineOutputListeners.forEach(h => h(line));
                }
            }
            else {
                break;
            }
        }
    }
}