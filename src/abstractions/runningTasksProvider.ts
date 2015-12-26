'use strict';

export interface RunningTasksProvider {
    runningTasks() : Iterable<string>;
}