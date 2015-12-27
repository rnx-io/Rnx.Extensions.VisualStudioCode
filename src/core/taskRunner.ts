'use strict';

import {ChildProcess, exec} from 'child_process';
import {workspace} from 'vscode';
import {TaskRunListener} from '../abstractions/taskRunListener';
import {TaskStartInfo} from '../abstractions/taskStartInfo';
import {TaskOutputHandler} from './taskOutputHandler';

const KILL_SIGNAL:string = "SIGKILL";

export class TaskRunner {
    private listeners: Set<TaskRunListener>;
    private taskProcessMap: Map<string,ChildProcess>;
    
    constructor() {
        this.listeners = new Set<TaskRunListener>();
        this.taskProcessMap = new Map<string,ChildProcess>();
    }
    
    public run(taskName:string, args:string) : void {
        let taskStartInfo = new TaskStartInfo(taskName, args);
        let commandLine = this.buildCommandLine(taskName, args);
        let cp = exec(commandLine, { cwd: workspace.rootPath });
        this.taskProcessMap.set(taskName, cp);
        
        // notify listeners that a task has started
        this.listeners.forEach(l => l.onTaskStart(taskStartInfo));
        
        let outputListeners = Array.from(taskStartInfo.taskOutputListeners);
        let stdOutputHandler = new TaskOutputHandler(outputListeners.map(f => f.onStdOut));
        let stdErrorHandler = new TaskOutputHandler(outputListeners.map(f => f.onStdErr));
        cp.stdout.on('data', data => stdOutputHandler.onData(data));
        cp.stderr.on('data', data => stdErrorHandler.onData(data));
        cp.addListener("exit", (exitCode, signal) => 
        {
            this.taskProcessMap.delete(taskName);
            let wasAborted:boolean = signal === KILL_SIGNAL;
            this.listeners.forEach(l => l.onTaskComplete(taskName, exitCode, wasAborted));
        });
    }
    
    public addListener(listener: TaskRunListener) : void {
        this.listeners.add(listener);
    }
    
    public runningTasks() : Iterable<string> {
        return this.taskProcessMap.keys();
    }
    
    public abort(taskName: string) : void {
        let cp = this.taskProcessMap.get(taskName);
        
        if(cp) {
            cp.stdout.pause();
            cp.stderr.pause();
            cp.kill(KILL_SIGNAL);
        }
    }
    
    public dispose() {
        this.listeners.forEach(f => f.dispose());
        this.listeners.clear();
        Array.from(this.taskProcessMap.values()).forEach(f => f.kill());
        this.taskProcessMap.clear();
    }
    
    private buildCommandLine(taskName:string, args:string) : string {
        return `dnx -p "${workspace.rootPath}" rnx ${taskName} ${args}`;
    }
}