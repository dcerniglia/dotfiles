"use strict";
var charactersToTabOutFrom_1 = require('./charactersToTabOutFrom');
var vscode_1 = require('vscode');
function returnHighest(num1, num2) {
    return num1 > num2 ? num1 : num2;
}
exports.returnHighest = returnHighest;
function returnLowest(num1, num2) {
    return num1 < num2 ? num1 : num2;
}
exports.returnLowest = returnLowest;
function oneNumberIsNegative(num1, num2) {
    return (num1 <= -1 || num2 <= -1);
}
exports.oneNumberIsNegative = oneNumberIsNegative;
function getPreviousChar(currentPosition, text) {
    return text.substring(currentPosition - 1, currentPosition);
}
exports.getPreviousChar = getPreviousChar;
function getNextChar(currentPosition, text) {
    return text.substring(currentPosition + 1, currentPosition);
}
exports.getNextChar = getNextChar;
function determineNextSpecialCharPosition(charInfo, text, position) {
    var positionNextOpenChar = text.indexOf(charInfo.open, position + 1);
    if (positionNextOpenChar == -1) {
        positionNextOpenChar = text.indexOf(charInfo.close, position + 1);
    }
    if (positionNextOpenChar == -1) {
        //find first other special character    
        var strToSearchIn = text.substr(position);
        var counter = position;
        for (var _i = 0, strToSearchIn_1 = strToSearchIn; _i < strToSearchIn_1.length; _i++) {
            var char = strToSearchIn_1[_i];
            counter++;
            var info = charactersToTabOutFrom_1.characterSetsToTabOutFrom().find(function (c) { return c.open == char || c.close == char; });
            if (info !== undefined) {
                positionNextOpenChar = counter;
                break;
            }
        }
    }
    return positionNextOpenChar;
}
exports.determineNextSpecialCharPosition = determineNextSpecialCharPosition;
function selectNextCharacter(text, position) {
    var nextCharacter = getNextChar(position, text);
    var indxNext = charactersToTabOutFrom_1.characterSetsToTabOutFrom().find(function (o) { return o.open == nextCharacter || o.close == nextCharacter; });
    if (indxNext !== undefined) {
        //no tab, put selection just AFTER the next special character 
        var nextCursorPosition = new vscode_1.Position(vscode_1.window.activeTextEditor.selection.active.line, position + 1);
        return vscode_1.window.activeTextEditor.selection = new vscode_1.Selection(nextCursorPosition, nextCursorPosition);
    }
    //Default
    vscode_1.commands.executeCommand("tab");
}
exports.selectNextCharacter = selectNextCharacter;
//# sourceMappingURL=utils.js.map