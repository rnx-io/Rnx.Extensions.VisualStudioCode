'use strict';

import {TaskOutputListener} from './taskOutputListener';

export class TaskStartInfo {
    taskOutputListeners: Set<TaskOutputListener>;
    
    constructor(public taskName: string, public args: string) {
        this.taskOutputListeners = new Set<TaskOutputListener>();
    }
}