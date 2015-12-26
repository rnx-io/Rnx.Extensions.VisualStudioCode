'use strict';

import {window} from 'vscode';
import {TaskRunListener} from '../abstractions/taskRunListener';
import {RnxJsonConfig} from '../abstractions/rnxJsonConfig';
import {TaskInfo} from '../abstractions/taskInfo';
import {RunningTasksProvider} from '../abstractions/runningTasksProvider';
import {TaskRunner} from './taskRunner';
import {loadRnxJson} from './rnxJsonLoader';
import {parseTaskNames} from './taskNameParser';

export class Rnx implements RunningTasksProvider {
    
    private taskRunner: TaskRunner;
    private rnxConfig: RnxJsonConfig;
    
    constructor() {
        this.taskRunner = new TaskRunner();
    }
    
    public load() : void {
        loadRnxJson().then(cfg => {
            this.rnxConfig = <RnxJsonConfig>cfg; // save for later
            return this.getSourceCodeFileNames();
        })
        .then(parseTaskNames)
        .then(tasks => {
            this.displayAvailableTasks(tasks);
        });
    }
    
    public addTaskRunListener(listener: TaskRunListener) : void {
        this.taskRunner.listeners.add(listener);
    }
    
    public runningTasks() : Iterable<string> {
        return this.taskRunner.runningTasks();
    }
    
    public terminateTask(taskName: string) : void {
        this.taskRunner.abort(taskName);
    }
    
    private displayAvailableTasks(tasks: TaskInfo[]) {
        if(tasks.length == 0) {
            window.showWarningMessage("No rnx tasks found");
        }
        else {
            window.showQuickPick(tasks).then(value => {
                if(value) {
                    let args = this.rnxConfig && this.rnxConfig.args ? this.rnxConfig.args : "";
                    this.taskRunner.run(value.label, args);
                }
            });
        }
    }

    // get all source code files that contain tasks
    // if no rnx.json file is found, we expect a "rnx.cs" file
    private getSourceCodeFileNames() : Iterable<string> {
        let csFileGlobPatterns: Set<string> = new Set<string>();
        
        if(this.rnxConfig && this.rnxConfig.sources) {
            for(let source of this.rnxConfig.sources) {
                csFileGlobPatterns.add(source);
            }
        }
        else {
            csFileGlobPatterns.add("rnx.cs");    
        }
        
        return csFileGlobPatterns;
    }
    
    public dispose() : void {
        this.taskRunner.dispose();
        this.taskRunner = null;
        this.rnxConfig = null;
    }
}