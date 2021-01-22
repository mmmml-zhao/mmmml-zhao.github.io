---
layout: post
title: webpack与web性能优化
date: 2021-01-22 17:10:30 +0300
description: 小程序自定义table组件。
img: 2021-01-22/webpack.svg
tags: [小程序,微信,typescript]
---  

介于前天有关web性能优化相关，想到webpack相关的知识有些遗忘，在此记录一下。  
1. 代码分离  
代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。
* 入口起点：使用 entry 配置手动地分离代码。  
  webpack.config.js
  ```javascript
  entry: {
    index: './src/index.js',
    another: './src/another-module.js',
  }
  ```
  指定多入口文件。

* 防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk。  
  webpack.config.js
  ```javascript
  // dependencies
  entry: {
    index: {
      import: './src/index.js',
      dependOn: 'shared',
    },
    another: {
      import: './src/another-module.js',
      dependOn: 'shared',
    },
    shared: 'lodash',
  },  
  optimization: {
    runtimeChunk: 'single',
  },

  // or
  // SplitChunksPlugin
   optimization: {
     splitChunks: {
       chunks: 'all',
     },
   },

  ```
* 动态导入：通过模块的内联函数调用来分离代码。  
不是在文件的开头静态import导入模块，而是到需要的地方再执行import导入。代码中的import 是以函数形式呈现，返回一个`promise`。  
* 预获取/预加载模块(prefetch/preload module)   
prefetch(预获取)：将来某些导航下可能需要的资源。  
 ```javascript
 import(/* webpackPrefetch: true */ './path/to/LoginModal.js')
 ```  
preload(预加载)：当前导航下可能需要资源。  
 ```javascript
import(/* webpackPreload: true */ 'ChartingLibrary');
 ```    

2. 缓存  
webpack 来打包我们的模块化后的应用程序，webpack 会生成一个可部署的 /dist 目录，然后把打包后的内容放置在此目录中。只要 /dist 目录中的内容部署到 server 上，client（通常是浏览器）就能够访问此 server 的网站及其资源。而最后一步获取资源是比较耗费时间的，这就是为什么浏览器使用一种名为 缓存 的技术。可以通过命中缓存，以降低网络流量，使网站加载速度更快。  
* 更换输出文件的文件名。webpack 提供了一种使用称为 substitution(可替换模板字符串) 的方式，设置output字段的filename为带括号字符串来模板化文件名。
* 生成runtime bundle文件，将第三方库的内容与页面逻辑分开
webpack.config.js
* 添加模块标识符，配置`moduleIds: 'deterministic'`设置moduleIds为如果是文件未改变则使用原有标识符，文件名里的hash值也为原hash值。
```javascript
 module.exports = {
    entry: './src/index.js',
    plugins: [
      // 对于 CleanWebpackPlugin 的 v2 versions 以下版本，使用 new CleanWebpackPlugin(['dist/*'])
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Caching',
      }),
    ],
    output: {
      filename: '[name].[contenthash].js',// 1
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
      runtimeChunk: 'single',// 2
      moduleIds: 'deterministic',// 3
      splitChunks: {
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           chunks: 'all',
         },
       },
     },
    },
  };
```