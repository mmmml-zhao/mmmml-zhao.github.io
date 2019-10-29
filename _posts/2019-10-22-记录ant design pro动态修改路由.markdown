---
layout: post
title: ant design pro 动态修改路由
date: 2019-10-22 17:50:30 +0300
description: 公共cms使用ant design pro框架，需要使用动态注入路由
img: 2019-10-22/antd.svg 
tags: [react,ts,ant design pro,umi]
---
***以下ant design pro 用adp简称***  

## 问题描述：
1. 技术选型  
使用`react`，`ts`，`ant design pro`。

2. 所遇问题  
从官方issues中看出，在adp这个框架里，路由的定义需要在config/config，ts里确定，因为它使用了umi（企业级react 应用框架），umi需要这个列表来使用`react-route-dom`，构建路由表，但不是所有用户都能进入特定的页面，这是需要鉴权的。对此adp在路由数组里的路由对象里用`authority（array）`字段表示能进来的用户，如`['super_admin]`是只有super_admin能进，`[]`则无人能进，不设置则所有人都能进，然后umi使用Router字段指定用于鉴权的高阶组件。
![ant design pro 路由设置](../assets/img/2019-10-22/adp路由.jpg "ant design pro路由")
这里带来了问题。由于资源、角色、人员都是后台添加的，所以角色名都是不固定的，权限也细化到了接口，没办法在一开始就在`authority`里写入，对应的角色名。所以需要改写。

3. 解决方法  
* 配置config  
在`config/config.ts`里的`routes`定义路由列表时，路由对象不要`authority`字段（意味该路由不需要鉴权）。
![初始路由定义](../assets/img/2019-10-22/config.router.jpg "初始路由定义")
* 请求权限列表，拉取权限信息  
注意上图中定义`Routes`字段的组件`BasicLayout`，当代码进入到`BasicLayout`后会先进入用于鉴权的高阶组件，再进入子路由。因此要在进入子路由之前请求权限信息，之前我是写在`BasicLayout`里，后来发现这样写并不是很好，于是提升到了`SecurityLayout`。  
在`SecurityLayout`里，用一个变量`loading（boolean）`限制页面渲染，useState函数参数里执行`dispatch`，触发`redux`的方法请求，将请求结果缓存起来，页面内则有一个`useEffect`(只会因components， authList变化而触发的hook)将处理过的权限数组（将有权限的的路由页面对象的authority字段设为这个人的角色名数组，如['super_admin']，没有权限的则设置成[]），按照路由的格式unshift到页面的route里，处理好route后则设置`loading`为`true`，渲染子组件，这时候，子组件已经有了正确的`authority`了。
![umi路由鉴权](../assets/img/2019-10-22/umi路由鉴权.jpg "umi路由鉴权")  
  
参考链接
[umi路由](https://umijs.org/zh/guide/router.html#%E9%85%8D%E7%BD%AE%E5%BC%8F%E8%B7%AF%E7%94%B1 "umi路由")&emsp;
[ant design pro路由](https://pro.ant.design/docs/router-and-nav-cn "ant design pro路由")&emsp;
[ant design pro issues里提供的方法](https://github.com/ant-design/ant-design-pro/issues/4691)