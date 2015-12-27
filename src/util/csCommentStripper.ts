'use strict';

// modified version of http://james.padolsey.com/javascript/removing-comments-in-javascript/
export function removeComments(s: string) : string {
    let mode = {
        doubleQuote: false,
        blockComment: false,
        lineComment: false
    };
    let chars = (" " + s + " ").split(''); // surround with spaces to avoid checking index
    
    for(let i = 0, l = chars.length; i < l; i++) {
        if (mode.doubleQuote) {
            if (chars[i] === '"' && chars[i-1] !== '\\') {
                mode.doubleQuote = false;
            }
            continue;
        }
 
        if (mode.blockComment) {
            if (chars[i] === '*' && chars[i+1] === '/') {
                chars[i+1] = '';
                mode.blockComment = false;
            }
            chars[i] = '';
            continue;
        }
 
        if (mode.lineComment) {
            if (chars[i+1] === '\n' || chars[i+1] === '\r') {
                mode.lineComment = false;
            }
            chars[i] = '';
            continue;
        }
 
        mode.doubleQuote = chars[i] === '"';
 
        if (chars[i] === '/') {
            if (chars[i+1] === '*') {
                chars[i] = '';
                mode.blockComment = true;
                continue;
            }
            if (chars[i+1] === '/') {
                chars[i] = '';
                mode.lineComment = true;
                continue;
            }
        }
    }
    
    return chars.join('').trim();
}