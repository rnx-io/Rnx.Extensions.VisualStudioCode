'use strict';

import {window, workspace} from 'vscode';
import {TaskRunListener} from '../abstractions/taskRunListener';
import {RunningTasksProvider} from '../abstractions/runningTasksProvider';
import {TaskRunner} from './taskRunner';
import {parseTaskNames} from './taskNameParser';

export class Rnx implements RunningTasksProvider {
    
    private taskRunner: TaskRunner;
    
    constructor() {
        this.taskRunner = new TaskRunner();
    }
    
    public load() : void {
        var tasks = parseTaskNames()
        
        if(tasks.length == 0) {
            window.showWarningMessage("No rnx tasks found");
        }
        else {
            window.showQuickPick(tasks).then(value => {
                if(value) {
                    let cmdArgs = workspace.getConfiguration("rnx").get<string>("commandLineArgs");
                    this.taskRunner.run(value.label, cmdArgs);
                }
            });
        }
    }
    
    public addTaskRunListener(listener: TaskRunListener) : void {
        this.taskRunner.addListener(listener);
    }
    
    public runningTasks() : Iterable<string> {
        return this.taskRunner.runningTasks();
    }
    
    public terminateTask(taskName: string) : void {
        this.taskRunner.abort(taskName);
    }
    
    public dispose() : void {
        this.taskRunner.dispose();
        this.taskRunner = null;
    }
}