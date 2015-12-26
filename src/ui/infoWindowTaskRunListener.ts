'use strict';

import * as vscode from 'vscode';
import {TaskRunListener} from '../abstractions/taskRunListener';
import {TaskStartInfo} from '../abstractions/taskStartInfo';

export class InfoWindowTaskRunListener implements TaskRunListener {
    
    public onTaskStart(taskStartInfo: TaskStartInfo) : void {
        if(this.displayTaskStatus()) {
            vscode.window.showInformationMessage("Rnx task '" + taskStartInfo.taskName + "' started...");
        } 
    }
    
    public onTaskComplete(taskName: string, exitCode: number, wasAborted: boolean) : void {
        if(exitCode == 0) {
            if(this.displayTaskStatus()) {
                vscode.window.showInformationMessage("Rnx task '" + taskName + "' completed successfully");
            }
        }
        else {
            if(wasAborted){
                vscode.window.showWarningMessage("Rnx task '" + taskName + "' was aborted.");
            }
            else {
                vscode.window.showErrorMessage("Rnx task '" + taskName + "' failed.");
            }
        }
    }
    
    private displayTaskStatus() : boolean {
        return vscode.workspace.getConfiguration("rnx").get<boolean>("displayTaskStatus");
    }
    
    public dispose() {
    }
}