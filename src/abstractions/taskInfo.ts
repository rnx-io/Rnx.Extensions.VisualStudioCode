'use strict';

import {QuickPickItem} from 'vscode';

export class TaskInfo implements QuickPickItem {
    constructor(public label: string, public description: string) {
    }
}