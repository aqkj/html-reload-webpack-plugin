"use strict";
/**
 * 重载plugin
 * @author xiaoqiang <465633678@qq.com>
 * @created 2019/08/27 14:32:45
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = __importDefault(require("socket.io"));
var os_1 = __importDefault(require("os"));
var portfinder_1 = __importDefault(require("portfinder"));
var pluginName = 'HtmlReloadWebpackPlugin';
// 缓存html
var oldHtml = {};
var newHtml = {};
// 是否可以刷新
var canRefresh = false;
var host = getLocalIP();
var port = 22322;
portfinder_1.default.basePort = port;
var io = null;
module.exports = /** @class */ (function () {
    function HtmlReloadPlugin() {
    }
    HtmlReloadPlugin.prototype.apply = function (compiler) {
        !io && portfinder_1.default.getPort(function (err, _port) {
            if (err) {
                throw err;
            }
            port = _port;
            io = socket_io_1.default(port);
            console.log("\u001B[2m[HtmlReloadPlugin]\u001B[0m: socket\u7AEF\u53E3\u542F\u52A8\u4E8E \u001B[1m\u001B[34m" + port + "\u001B[0m");
        });
        compiler.hooks.compilation.tap(pluginName, function (compilation) {
            ;
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(pluginName, function (htmlPluginData, callback) {
                // 暂存新html
                var nHtml = newHtml[htmlPluginData.outputName] = htmlPluginData.html;
                if (nHtml !== oldHtml[htmlPluginData.outputName]) {
                    canRefresh = true;
                }
                oldHtml[htmlPluginData.outputName] = nHtml;
                htmlPluginData.html = nHtml.replace(/(\<\/body\>)/, "<script src=\"http://" + host + ":" + port + "/socket.io/socket.io.js\"></script>\n              <script>\n                var socket = io.connect(\"http://" + host + ":" + port + "\");\n                socket.on(\"reload\", function(){\n                  window.location.reload()\n                });\n              </script>\n            </body>");
                callback(null, htmlPluginData);
            });
        });
        compiler.hooks.done.tap(pluginName, function () {
            // 判断是否需要刷新
            if (!canRefresh) {
                return;
            }
            io.emit('reload');
            canRefresh = false;
        });
    };
    return HtmlReloadPlugin;
}());
/**
 * 获取本地ip
 */
function getLocalIP() {
    var ifaces = os_1.default.networkInterfaces();
    return (ifaces.en0 || ifaces.以太网).slice(-1)[0].address;
}
