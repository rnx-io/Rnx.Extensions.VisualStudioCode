'use strict';

import {workspace, commands, ExtensionContext, window} from 'vscode';
import {Rnx} from './core/Rnx';
import {InfoWindowTaskRunListener} from './ui/infoWindowTaskRunListener';
import {StatusBarTaskRunListener} from './ui/statusBarTaskRunListener';
import {OutputChannelTaskRunListener} from './ui/outputChannelTaskRunListener';
import {TaskInfo} from './abstractions/taskInfo';

let rnx: Rnx;

export function activate(context: ExtensionContext) {
	let rnxExtension = commands.registerCommand('extension.rnx', () => {
        if (!workspace.rootPath) {
            return;
        }
        
        if(!rnx) {
            rnx = new Rnx();
            rnx.addTaskRunListener(new InfoWindowTaskRunListener());
            rnx.addTaskRunListener(new OutputChannelTaskRunListener());
            rnx.addTaskRunListener(new StatusBarTaskRunListener(rnx));
        }
        
        rnx.load();
	});
    
    let rnxKillExtension = commands.registerCommand('extension.rnx.kill', () => {
        if (!rnx) {
            return;
        }
        
        let runningTasks = Array.from(rnx.runningTasks());
        
        if(runningTasks.length == 0) {
            window.showWarningMessage("No tasks are running");
        }
        else {
            let tasks = runningTasks.map(f => new TaskInfo(f, "Terminate task '" + f + "'"));
            
            window.showQuickPick(tasks).then(value => {
                if(value) {
                    rnx.terminateTask(value.label);
                }
            });
        }
	});
    
	context.subscriptions.push(rnxExtension);
    context.subscriptions.push(rnxKillExtension);
}

export function deactivate() {
    if(rnx) {
        rnx.dispose();
        rnx = null;
    }
}