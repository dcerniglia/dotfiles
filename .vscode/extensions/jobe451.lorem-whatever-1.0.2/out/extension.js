"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const lorem_1 = require("./lorem");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let defaultMinWordSize = 200;
const generatorsMap = new Map();
function activate(context) {
    let commands = [
        vscode.commands.registerCommand('loremWhatever.loremGibson', () => {
            runGenerator(lorem_1.PredefinedGenerators.GIBSON);
        }),
        vscode.commands.registerCommand('loremWhatever.loremBuzzword', () => {
            runGenerator(lorem_1.PredefinedGenerators.BUZZWORD);
        }),
        vscode.commands.registerCommand('loremWhatever.loremConstitution', () => {
            runGenerator(lorem_1.PredefinedGenerators.CONSTITUTION);
        }),
        vscode.commands.registerCommand('loremWhatever.loremBasel3', () => {
            runGenerator(lorem_1.PredefinedGenerators.BASEL3);
        }),
        vscode.commands.registerCommand('loremWhatever.loremFaust', () => {
            runGenerator(lorem_1.PredefinedGenerators.FAUST);
        }),
        vscode.commands.registerCommand('loremWhatever.loremGenesis', () => {
            runGenerator(lorem_1.PredefinedGenerators.GENESIS);
        }),
        vscode.commands.registerCommand('loremWhatever.loremLorem', () => {
            runGenerator(lorem_1.PredefinedGenerators.LOREM);
        }),
        vscode.commands.registerCommand('loremWhatever.loremCustom1', () => {
            runGenerator("Custom1");
        }),
        vscode.commands.registerCommand('loremWhatever.loremCustom2', () => {
            runGenerator("Custom2");
        }),
        vscode.commands.registerCommand('loremWhatever.loremCustom3', () => {
            runGenerator("Custom3");
        }),
        vscode.commands.registerCommand('loremWhatever.loremCustom4', () => {
            runGenerator("Custom4");
        }),
        vscode.commands.registerCommand('loremWhatever.loremCustom5', () => {
            runGenerator("Custom5");
        }),
        vscode.commands.registerCommand('loremWhatever.loremDefault', () => {
            let defaultLoremName = vscode.workspace.getConfiguration('loremWhatever').get("defaultLorem");
            let generatorType;
            if (defaultLoremName === "Genesis") {
                generatorType = lorem_1.PredefinedGenerators.GENESIS;
            }
            else if (defaultLoremName === "Faust") {
                generatorType = lorem_1.PredefinedGenerators.FAUST;
            }
            else if (defaultLoremName === "Gibson") {
                generatorType = lorem_1.PredefinedGenerators.GIBSON;
            }
            else if (defaultLoremName === "Constitution") {
                generatorType = lorem_1.PredefinedGenerators.CONSTITUTION;
            }
            else if (defaultLoremName === "Basel 3") {
                generatorType = lorem_1.PredefinedGenerators.BASEL3;
            }
            else if (defaultLoremName === "Buzzword") {
                generatorType = lorem_1.PredefinedGenerators.BUZZWORD;
            }
            else if (defaultLoremName === "Lorem Ipsum") {
                generatorType = lorem_1.PredefinedGenerators.LOREM;
            }
            else if (defaultLoremName === "Custom 1") {
                generatorType = "Custom1";
            }
            else if (defaultLoremName === "Custom 2") {
                generatorType = "Custom2";
            }
            else if (defaultLoremName === "Custom 3") {
                generatorType = "Custom3";
            }
            else if (defaultLoremName === "Custom 4") {
                generatorType = "Custom4";
            }
            else if (defaultLoremName === "Custom 5") {
                generatorType = "Custom5";
            }
            else {
                generatorType = lorem_1.PredefinedGenerators.GIBSON;
            }
            runGenerator(generatorType);
        }),
    ];
    commands.forEach((command) => {
        context.subscriptions.push(command);
    });
}
exports.activate = activate;
function runGenerator(mapType) {
    let generator;
    generator = generatorsMap.get(mapType);
    if (generator === undefined) {
        if (typeof mapType === "string") {
            let configCustomArray = [];
            let customLorems = vscode.workspace.getConfiguration('loremWhatever').get("customLorems");
            if (customLorems) {
                configCustomArray = customLorems[mapType];
            }
            if (configCustomArray instanceof Array && configCustomArray.length > 0) {
                generator = new lorem_1.LoremWhateverGenerator(configCustomArray);
            }
            else {
                vscode.window.showInformationMessage("lorem type " + mapType + " is either undefined or empty. Please check the settings.");
                return;
            }
        }
        else {
            generator = new lorem_1.LoremWhateverGenerator(mapType);
        }
        generatorsMap.set(mapType, generator);
    }
    let configMinWordSize = vscode.workspace.getConfiguration('loremWhatever').get("minWordCount");
    let loremIpsumBehaviour = lorem_1.LoremIpsumBehaviour.START_CLASSIC;
    if (mapType === lorem_1.PredefinedGenerators.LOREM) {
        let loremIpsumBehaviourConfigText = vscode.workspace.getConfiguration('loremWhatever').get("loremIpsumBehaviour");
        if (loremIpsumBehaviourConfigText === "Random") {
            loremIpsumBehaviour = lorem_1.LoremIpsumBehaviour.RANDOM;
        }
        else if (loremIpsumBehaviourConfigText === "Only classic Lorem Ipsum") {
            loremIpsumBehaviour = lorem_1.LoremIpsumBehaviour.ONLY_CLASSIC;
        }
    }
    let loremText = generator.getSentencesByMinWordCount(configMinWordSize ? configMinWordSize : defaultMinWordSize, loremIpsumBehaviour);
    insertText(loremText);
}
function insertText(lorem) {
    var editor = vscode.window.activeTextEditor;
    if (editor !== undefined) {
        editor.edit((edit) => {
            if (editor !== undefined) {
                editor.selections.forEach((selection) => {
                    edit.delete(selection);
                    edit.insert(selection.start, lorem);
                    edit.insert(selection.start, "\n");
                });
            }
        });
    }
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map