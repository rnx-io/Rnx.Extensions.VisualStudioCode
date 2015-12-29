'use strict';

export function splitCommandLine(commandLine: string) : string[] {
    let output = "";
    let escaped = false;

    for (let i = 0; i < commandLine.length; i++) {
        if (commandLine[i] == '"') {
            escaped = !escaped;
        }
        else if (commandLine[i] == ' ' && !escaped) {
            output += '\n';
        }
        else {
            output += commandLine[i];    
        }
    }

    return output.split("\n").filter(f => f.trim().length > 0);
}