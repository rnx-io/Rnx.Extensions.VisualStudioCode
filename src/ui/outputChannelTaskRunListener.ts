'use strict';

import {window, OutputChannel, ViewColumn, workspace} from 'vscode';
import {TaskRunListener} from '../abstractions/taskRunListener';
import {TaskStartInfo} from '../abstractions/taskStartInfo';
import {TaskOutputListener} from '../abstractions/taskOutputListener';

export class OutputChannelTaskRunListener implements TaskRunListener {
    
    private outputChannels: Map<string,OutputChannel>;
    
    constructor() {
        this.outputChannels = new Map<string,OutputChannel>();
    }
    
    public onTaskStart(taskStartInfo: TaskStartInfo) : void {
        
        let outputChannel = window.createOutputChannel(`Rnx: ${taskStartInfo.taskName}`);
        this.outputChannels.set(taskStartInfo.taskName, outputChannel);
        
        taskStartInfo.taskOutputListeners.add(<TaskOutputListener>{
            onStdOut: line => outputChannel.appendLine(line),
            onStdErr: line => outputChannel.appendLine(line)
        });
        
        outputChannel.clear();
        outputChannel.show(<ViewColumn>this.taskOutputViewColumn());
    }
    
    public onTaskComplete(taskName: string, exitCode: number, wasAborted: boolean) : void {
        if(this.hideOutputWindowOnSuccess()) {
            let outputChannel = this.outputChannels.get(taskName);
            
            if(outputChannel) {
                outputChannel.hide();
            }
        }
    }
        
    private hideOutputWindowOnSuccess() : boolean {
        return workspace.getConfiguration("rnx").get<boolean>("hideOutputWindowOnSuccess");
    }
    
    private taskOutputViewColumn() : number {
        return workspace.getConfiguration("rnx").get<number>("taskOutputViewColumn");
    }
    
    public dispose() {
        this.outputChannels.forEach( (v, k, m) => {
            v.clear();
            v.hide();
            v.dispose();
        });
        this.outputChannels.clear();
    }
}