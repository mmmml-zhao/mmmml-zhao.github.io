---
layout: main
title: vue-router(未完待续)
date: 2018-01-29 19:27:30 +0300
description: vue-router知识
tags: [js,vue]
---

vue-router
1.  在index.js 顶部引入模板  

2. 在下面Vue,use(Router)注册插件  

3. 创建router实例，注册路由，格式如下
```javascript
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path:'/',
      name:'index',
      component:index,
      redirect:'/indexContent',
      children:[
        {
          path:'/indexContent',
          name:'indexContent',
          component:indexContent
        }
      ]
    },
  ]
```
  

4. 名词解释
path: 路径   （‘/‘是指根路径）
name: 路径名称 (通过路径传值)
component:这个路由的模板
childen:子路由
redirect:默认打开的路径
  

5. 路由传参
    * 使用`name`,在模板中使用`{{$route.name}}`，当一个路由有子路由，那么这个路由的name是无用的
    *  使用<router-view v-bink:to=“{name:'xxx',params:{id:123}}”>点击跳转<router-view>
这里数据绑定`to`必须绑定一个json，在json外加个双引号，然后再子路由中使用`{{$route.params.id}}`,注意是`route`,

6. 路由表的组件群
这里的组件群是指，当一个路由的component（即组件）并不是一个，而是好几个，而这几个我想在浏览器的不同地方展示，有点像slot，对应的填充，格式如下

路由定义，该路由有三个组件，
```javascript
{
    path：'/'，
    components:{
        default:home,
        left:first,
        right:second
    }
}
```
在展示这个路由的页面的路由出口分别给上定义路由时使用的组件名称（是components中左边的），然后展现时就是一一对应的展示出来，如下
```javascript
<router-view>这是默认的，未取名的路由的出口</router-view>
<router-view name='left'>这是left的出口</router-view>
<router-view name='right'>这是right的出口</router-view>
```
