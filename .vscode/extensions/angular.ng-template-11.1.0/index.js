'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vscode = require('vscode');
var fs = require('fs');
var path = require('path');
var node = require('vscode-languageclient/node');
var vscodeJsonrpc = require('vscode-jsonrpc');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var vscode__default = /*#__PURE__*/_interopDefaultLegacy(vscode);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var node__default = /*#__PURE__*/_interopDefaultLegacy(node);
var vscodeJsonrpc__default = /*#__PURE__*/_interopDefaultLegacy(vscodeJsonrpc);

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var notifications = createCommonjsModule(function (module, exports) {
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectLanguageService = exports.ProjectLoadingFinish = exports.ProjectLoadingStart = void 0;

exports.ProjectLoadingStart = new vscodeJsonrpc__default['default'].NotificationType0('angular/projectLoadingStart');
exports.ProjectLoadingFinish = new vscodeJsonrpc__default['default'].NotificationType0('angular/projectLoadingFinish');
exports.ProjectLanguageService = new vscodeJsonrpc__default['default'].NotificationType('angular/projectLanguageService');

});

unwrapExports(notifications);
var notifications_1 = notifications.ProjectLanguageService;
var notifications_2 = notifications.ProjectLoadingFinish;
var notifications_3 = notifications.ProjectLoadingStart;

var progress = createCommonjsModule(function (module, exports) {
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgccProgressType = exports.NgccProgressToken = void 0;

exports.NgccProgressToken = 'ngcc';
exports.NgccProgressType = new vscodeJsonrpc__default['default'].ProgressType();

});

unwrapExports(progress);
var progress_1 = progress.NgccProgressType;
var progress_2 = progress.NgccProgressToken;

var progressReporter = createCommonjsModule(function (module, exports) {
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressReporter = void 0;

const EMPTY_DISPOSABLE = vscode__default['default'].Disposable.from();
class ProgressReporter {
    constructor() {
        this.lastMessage = EMPTY_DISPOSABLE;
    }
    report(value) {
        this.lastMessage.dispose(); // clear the last message
        // See https://code.visualstudio.com/api/references/icons-in-labels for
        // icons available in vscode. "~spin" animates the icon.
        this.lastMessage = vscode__default['default'].window.setStatusBarMessage(`$(sync~spin) Angular: ${value}`);
    }
    finish() {
        this.lastMessage.dispose();
        this.lastMessage = EMPTY_DISPOSABLE;
    }
}
exports.ProgressReporter = ProgressReporter;

});

unwrapExports(progressReporter);
var progressReporter_1 = progressReporter.ProgressReporter;

var client = createCommonjsModule(function (module, exports) {
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularLanguageClient = void 0;







class AngularLanguageClient {
    constructor(context) {
        this.context = context;
        this.client = null;
        this.disposables = [];
        this.name = 'Angular Language Service';
        this.outputChannel = vscode__default['default'].window.createOutputChannel(this.name);
        // Options to control the language client
        this.clientOptions = {
            // Register the server for Angular templates and TypeScript documents
            documentSelector: [
                // scheme: 'file' means listen to changes to files on disk only
                // other option is 'untitled', for buffer in the editor (like a new doc)
                { scheme: 'file', language: 'html' },
                { scheme: 'file', language: 'typescript' },
            ],
            synchronize: {
                fileEvents: [
                    // Notify the server about file changes to tsconfig.json contained in the workspace
                    vscode__default['default'].workspace.createFileSystemWatcher('**/tsconfig.json'),
                ]
            },
            // Don't let our output console pop open
            revealOutputChannelOn: node__default['default'].RevealOutputChannelOn.Never,
            outputChannel: this.outputChannel,
        };
    }
    /**
     * Spin up the language server in a separate process and establish a connection.
     */
    async start() {
        if (this.client !== null) {
            throw new Error(`An existing client is running. Call stop() first.`);
        }
        // If the extension is launched in debug mode then the debug server options are used
        // Otherwise the run options are used
        const serverOptions = {
            run: getServerOptions(this.context, false /* debug */),
            debug: getServerOptions(this.context, true /* debug */),
        };
        // Create the language client and start the client.
        const forceDebug = process.env['NG_DEBUG'] === 'true';
        this.client = new node__default['default'].LanguageClient(
        // This is the ID for Angular-specific configurations, like angular.log,
        // angular.ngdk, etc. See contributes.configuration in package.json.
        'angular', this.name, serverOptions, this.clientOptions, forceDebug);
        this.disposables.push(this.client.start());
        await this.client.onReady();
        // Must wait for the client to be ready before registering notification
        // handlers.
        registerNotificationHandlers(this.client);
        registerProgressHandlers(this.client, this.context);
    }
    /**
     * Kill the language client and perform some clean ups.
     */
    async stop() {
        if (this.client === null) {
            return;
        }
        await this.client.stop();
        this.outputChannel.clear();
        this.dispose();
        this.client = null;
    }
    get initializeResult() {
        var _a;
        return (_a = this.client) === null || _a === void 0 ? void 0 : _a.initializeResult;
    }
    dispose() {
        for (let d = this.disposables.pop(); d !== undefined; d = this.disposables.pop()) {
            d.dispose();
        }
    }
}
exports.AngularLanguageClient = AngularLanguageClient;
function registerNotificationHandlers(client) {
    client.onNotification(notifications.ProjectLoadingStart, () => {
        vscode__default['default'].window.withProgress({
            location: vscode__default['default'].ProgressLocation.Window,
            title: 'Initializing Angular language features',
        }, () => new Promise((resolve) => {
            client.onNotification(notifications.ProjectLoadingFinish, resolve);
        }));
    });
}
function registerProgressHandlers(client, context) {
    const progressReporters = new Map();
    const disposable = client.onProgress(progress.NgccProgressType, progress.NgccProgressToken, async (params) => {
        const { configFilePath } = params;
        if (!progressReporters.has(configFilePath)) {
            progressReporters.set(configFilePath, new progressReporter.ProgressReporter());
        }
        const reporter = progressReporters.get(configFilePath);
        if (params.done) {
            reporter.finish();
            progressReporters.delete(configFilePath);
            if (!params.success) {
                const selection = await vscode__default['default'].window.showErrorMessage(`Angular extension might not work correctly because ngcc operation failed. ` +
                    `Try to invoke ngcc manually by running 'npm/yarn run ngcc'. ` +
                    `Please see the extension output for more information.`, 'Show output');
                if (selection) {
                    client.outputChannel.show();
                }
            }
        }
        else {
            reporter.report(params.message);
        }
    });
    // Dispose the progress handler on exit
    context.subscriptions.push(disposable);
}
/**
 * Return the paths for the module that corresponds to the specified `configValue`,
 * and use the specified `bundled` as fallback if none is provided.
 * @param configName
 * @param bundled
 */
function getProbeLocations(configValue, bundled) {
    const locations = [];
    // Always use config value if it's specified
    if (configValue) {
        locations.push(configValue);
    }
    // Prioritize the bundled version
    locations.push(bundled);
    // Look in workspaces currently open
    const workspaceFolders = vscode__default['default'].workspace.workspaceFolders || [];
    for (const folder of workspaceFolders) {
        locations.push(folder.uri.fsPath);
    }
    return locations;
}
/**
 * Construct the arguments that's used to spawn the server process.
 * @param ctx vscode extension context
 * @param debug true if debug mode is on
 */
function constructArgs(ctx, debug) {
    const config = vscode__default['default'].workspace.getConfiguration();
    const args = ['--logToConsole'];
    const ngLog = config.get('angular.log', 'off');
    if (ngLog !== 'off') {
        // Log file does not yet exist on disk. It is up to the server to create the file.
        const logFile = path__default['default'].join(ctx.logPath, 'nglangsvc.log');
        args.push('--logFile', logFile);
        args.push('--logVerbosity', debug ? 'verbose' : ngLog);
    }
    const ngdk = config.get('angular.ngdk', null);
    const ngProbeLocations = getProbeLocations(ngdk, ctx.extensionPath);
    args.push('--ngProbeLocations', ngProbeLocations.join(','));
    const experimentalIvy = config.get('angular.experimental-ivy', false);
    if (experimentalIvy) {
        args.push('--experimental-ivy');
    }
    const tsdk = config.get('typescript.tsdk', null);
    const tsProbeLocations = getProbeLocations(tsdk, ctx.extensionPath);
    args.push('--tsProbeLocations', tsProbeLocations.join(','));
    return args;
}
function getServerOptions(ctx, debug) {
    // Environment variables for server process
    const prodEnv = {
        // Force TypeScript to use the non-polling version of the file watchers.
        TSC_NONPOLLING_WATCHER: true,
    };
    const devEnv = Object.assign(Object.assign({}, prodEnv), { NG_DEBUG: true });
    // Node module for the language server
    const prodBundle = ctx.asAbsolutePath('server');
    const devBundle = ctx.asAbsolutePath(path__default['default'].join('dist', 'server', 'server.js'));
    // Argv options for Node.js
    const prodExecArgv = [];
    const devExecArgv = [
        // do not lazily evaluate the code so all breakpoints are respected
        '--nolazy',
        // If debugging port is changed, update .vscode/launch.json as well
        '--inspect=6009',
    ];
    return {
        // VS Code Insider launches extensions in debug mode by default but users
        // install prod bundle so we have to check whether dev bundle exists.
        module: debug && fs__default['default'].existsSync(devBundle) ? devBundle : prodBundle,
        transport: node__default['default'].TransportKind.ipc,
        args: constructArgs(ctx, debug),
        options: {
            env: debug ? devEnv : prodEnv,
            execArgv: debug ? devExecArgv : prodExecArgv,
        },
    };
}

});

unwrapExports(client);
var client_1 = client.AngularLanguageClient;

var commands = createCommonjsModule(function (module, exports) {
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;

/**
 * Restart the language server by killing the process then spanwing a new one.
 * @param client language client
 * @param context extension context for adding disposables
 */
function restartNgServer(client) {
    return {
        id: 'angular.restartNgServer',
        async execute() {
            await client.stop();
            await client.start();
        },
    };
}
/**
 * Open the current server log file in a new editor.
 */
function openLogFile(client) {
    return {
        id: 'angular.openLogFile',
        async execute() {
            var _a;
            const serverOptions = (_a = client.initializeResult) === null || _a === void 0 ? void 0 : _a.serverOptions;
            if (!(serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.logFile)) {
                // Show a MessageItem to help users automatically update the
                // configuration option then restart the server.
                const selection = await vscode__default['default'].window.showErrorMessage(`Angular server logging is off. Please set 'angular.log' and restart the server.`, 'Enable logging and restart server');
                if (selection) {
                    const isGlobalConfig = false;
                    await vscode__default['default'].workspace.getConfiguration().update('angular.log', 'verbose', isGlobalConfig);
                    // Restart the server
                    await client.stop();
                    await client.start();
                }
                return;
            }
            const document = await vscode__default['default'].workspace.openTextDocument(serverOptions.logFile);
            return vscode__default['default'].window.showTextDocument(document);
        },
    };
}
/**
 * Register all supported vscode commands for the Angular extension.
 * @param client language client
 * @param context extension context for adding disposables
 */
function registerCommands(client, context) {
    const commands = [
        restartNgServer(client),
        openLogFile(client),
    ];
    for (const command of commands) {
        const disposable = vscode__default['default'].commands.registerCommand(command.id, command.execute);
        context.subscriptions.push(disposable);
    }
}
exports.registerCommands = registerCommands;

});

unwrapExports(commands);
var commands_1 = commands.registerCommands;

var extension = createCommonjsModule(function (module, exports) {
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;



function activate(context) {
    const client$1 = new client.AngularLanguageClient(context);
    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    commands.registerCommands(client$1, context);
    // Restart the server on configuration change.
    const disposable = vscode__default['default'].workspace.onDidChangeConfiguration(async () => {
        await client$1.stop();
        await client$1.start();
    });
    context.subscriptions.push(client$1, disposable);
    client$1.start();
}
exports.activate = activate;

});

var extension$1 = unwrapExports(extension);
var extension_1 = extension.activate;

exports.activate = extension_1;
exports.default = extension$1;
