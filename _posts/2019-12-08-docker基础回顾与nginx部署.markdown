---
layout: post
title: docker基础回顾与nginx部署
date: 2019-12-08 12:25:30 +0300
description: 通过nginx部署vue回顾、实践docker。
img: 2019-12-08/docker.png 
tags: [docker]
---

# docker

## 基本目标
通过部署前端项目，并成功访问，达到复习docker基本操作的目的。

## 步骤
1. 迅速过一遍docker文档（不记api,大概知道有什么配置即可）。
2. 通过vue ui 建立vue项目，并本地预览，build生成编译后文件。
3. `docker pull nginx` 下载nginx镜像，并根据[docker部署vue项目](https://www.jianshu.com/p/399e5a3c7cc5 "docker部署vue项目")，编写nginx配置。
4. 编写*dockerfile*。
![初始路由定义](../assets/img/2019-12-08/dockerfile.jpg "初始路由定义")
* 镜像拷贝自nginx。
* 复制dist文件夹到指定文件夹。
* 拷贝nginx配置到指定文件夹。
5. `docker build -t 镜像名 .`， -t后接镜像名，`.`是指使用当前目录下的dockerfile传讲新镜像。

6. `docker run -p 3002:80 -d --name 容器名 镜像名`，启动docker并将宿主机的3002端口指向docker的80端口，

由上述6步即可达到再nginx上部署前端项目的目的

## 遇到问题

1. dockrefile文件编写中，第三句本来是`COPY Nginx/default.conf /etc/nginx/conf.d/default.conf`,但是生成镜像总会卡在这一步，通过第二句，所以直接复制文件夹，就没问题了。  
搜索了一下为什么复制文件失败，提示找不到路径。说docker低版本没有复制文件的功能，查看了自己的版本号2.0.0.3并不是这个问题，最后发现，需要复制的目标文件夹并不需要指定文件名，指定到文件夹即可。

## 参考网站
[docker中文网](http://www.dockerinfo.net/document "docker"),
[docker部署vue项目](https://www.jianshu.com/p/399e5a3c7cc5 "docker部署vue项目")