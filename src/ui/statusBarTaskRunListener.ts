'use strict';

import {StatusBarItem, window} from 'vscode';
import {TaskRunListener} from '../abstractions/taskRunListener';
import {TaskStartInfo} from '../abstractions/taskStartInfo';
import {RunningTasksProvider} from '../abstractions/runningTasksProvider';

export class StatusBarTaskRunListener implements TaskRunListener {
    
    private statusBarItem: StatusBarItem;
    
    constructor(private runningTasksProvider: RunningTasksProvider) {
    }
    
    public onTaskStart(taskStartInfo: TaskStartInfo) : void {
        if(!this.statusBarItem) {
            this.statusBarItem = window.createStatusBarItem();
            this.statusBarItem.command = "extension.rnx.kill";
            this.statusBarItem.tooltip = "Click here to terminate running tasks";
        }
        
        this.onRunningTasksChanged();
        this.statusBarItem.show();
    }
    
    public onTaskComplete(taskName: string, exitCode: number, wasAborted: boolean) : void {
        this.onRunningTasksChanged();
    }
    
    public dispose() {
        if(this.statusBarItem) {
            this.statusBarItem.hide();
            this.statusBarItem.dispose();
        }
    }
    
    private onRunningTasksChanged() : void {
        let runningTasks = Array.from(this.runningTasksProvider.runningTasks());
        
        if(runningTasks.length == 0) {
            this.statusBarItem.hide();
        }
        else {
            if(runningTasks.length == 1) {
                this.statusBarItem.text = `$(chevron-right) Task '${runningTasks[0]}' running...`;
            }
            else {
                this.statusBarItem.text = `$(chevron-right) ${runningTasks.length} tasks running...`;
            }
        }
    }
}