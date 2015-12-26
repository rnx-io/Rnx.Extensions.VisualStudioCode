'use strict';

export interface TaskOutputListener {
    onStdOut: TaskLineOutputListener;
    onStdErr: TaskLineOutputListener;
}

export interface TaskLineOutputListener {
    (line: string) : void;
}