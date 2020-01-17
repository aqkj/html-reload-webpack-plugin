# @zouzhiqiang/html-reload-webpack-plugin

[![npm (scoped)](https://img.shields.io/npm/v/@zouzhiqiang/html-reload-webpack-plugin.svg)](https://www.npmjs.com/package/@zouzhiqiang/html-reload-webpack-plugin)
[![Downloads](http://img.shields.io/npm/dm/gulp-cli.svg)](https://www.npmjs.com/package/@zouzhiqiang/html-reload-webpack-plugin)

配合html-webpack-plugin实现修改自动刷新页面

## Install

```
$ npm install --save-dev @zouzhiqiang/html-reload-webpack-plugin
```

## Usage

```javascript
// 引入
const ReloadWebpackPlugin = require('@zouzhiqiang/html-reload-webpack-plugin');
{
    // ...webpack配置
    plugins: [
        // 添加插件
        new ReloadWebpackPlugin()
    ]
}
```
