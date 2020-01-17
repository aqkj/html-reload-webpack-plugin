/**
 * 重载plugin
 * @author xiaoqiang <465633678@qq.com>
 * @created 2019/08/27 14:32:45
 */

import Socket from 'socket.io'
import os from 'os'
import portfinder from 'portfinder'
const pluginName: string = 'HtmlReloadWebpackPlugin'
// 缓存html
const oldHtml: Record<string, string> = {}
const newHtml: Record<string, string> = {}
// 是否可以刷新
let canRefresh: boolean = false
const host: string = getLocalIP()
let port: number = 22322
portfinder.basePort = port
let io: Socket.Server | unknown = null
import webpack, { Compiler } from 'webpack'
module.exports = class HtmlReloadPlugin implements webpack.Plugin {
  apply(compiler: Compiler): void {
    !io && portfinder.getPort((err: Error,  _port: number) => {
      if (err) {
        throw err
      }
      port = _port
      io = Socket(port)
      console.log(`\x1B[2m[HtmlReloadPlugin]\x1B[0m: socket端口启动于 \x1B[1m\x1B[34m${port}\x1B[0m`)
    })
    compiler.hooks.compilation.tap(pluginName, (compilation: webpack.compilation.Compilation) => {
      ;(compilation.hooks as any).htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
        pluginName, (htmlPluginData: any, callback: any) => {
          // 暂存新html
          const nHtml: string = newHtml[htmlPluginData.outputName] = htmlPluginData.html
          if (nHtml !== oldHtml[htmlPluginData.outputName]) {
            canRefresh = true
          }
          oldHtml[htmlPluginData.outputName] = nHtml
          htmlPluginData.html = nHtml.replace(/(\<\/body\>)/,
            `<script src="http://${host}:${port}/socket.io/socket.io.js"></script>
              <script>
                var socket = io.connect("http://${host}:${port}");
                socket.on("reload", function(){
                  window.location.reload()
                });
              </script>
            </body>`)
          callback(null, htmlPluginData)
      })
    })
    compiler.hooks.done.tap(pluginName, () => {
      // 判断是否需要刷新
      if (!canRefresh) {
        return
      }
      (io as Socket.Server).emit('reload')
      canRefresh = false
    })
  }
}
/**
 * 获取本地ip
 */
function getLocalIP(): any {
  const ifaces: any = os.networkInterfaces()
  return (ifaces.en0 || ifaces.以太网).slice(-1)[0].address
}
