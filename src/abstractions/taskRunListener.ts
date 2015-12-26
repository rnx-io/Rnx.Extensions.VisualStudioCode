'use strict';

import {TaskStartInfo} from './taskStartInfo';

export interface TaskRunListener {
    onTaskStart(taskStartInfo: TaskStartInfo) : void;
    onTaskComplete(taskName: string, exitCode: number, wasAborted: boolean) : void;
    dispose() : void;
}