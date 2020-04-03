---
layout: post
title: vue hookEvent
date: 2020-04-03 09:58:30 +0300
description: 关于vue的生命周期事件。
img: 2020-04-03/docker.png 
tags: [vue]
---

# Vue hookEvent

## 情景
当在项目中引用一个组件，当子组件内的某个生命周期触发的时候，希望父组件能够进行一些操作，如果子组件没有暴露出对应的接口，那只能够通过修改组件的内部逻辑才能够实现想要的功能。

## 方法
`hookEvent`可以实现从父组件给子组件注入生命周期，且不会对子组件的生命周期产生影响。
该方法在vue的官方文档中没有显示，但vue的核心团队成员[Damian Dulisz](https://twitter.com/DamianDulisz)在[推文](https://twitter.com/DamianDulisz/status/981549658571968512)中明确说明了这种方法。

## 演示

### 理解
通过类似绑定自定义事件的形式在子组件上绑定形式如`@hook:${生命周期}`格式的事件(`@hook:beforeUpdate="beforeEvent"`)，则在父组件中可以监听子组件中相对应的事件触发。  

### 代码
```html
  <div id="app">
    <div>
      parent component num: {{num}}
    </div>
    <button @click="num+=1">123</button>
    <child-node :num="num" @hook:updated="afterEvent"></child-node>
  </div>
```  

```javascript
 // 定义一个名为 child-node 的新组件
  var childNode = {
    props: ["num"],
    template: '<div>child component num: {{ num }}</div>',
    beforeUpdate() {
      console.log('child component beforeUpdate!')
    },
    updated() {
      console.log('child component updated!')
    }
  }

  new Vue({
    el: '#app',
    data() {
      return {
        num: 1
      }
    },
    components: {
      childNode
    },
    methods: {
      beforeEvent() {
        console.log('parent component beforeEvent!')
      },
      afterEvent() {
        console.log('parent component afterEvent!')
      },
    },
    created() {}
  })
```
上述代码里，当点击按钮`num`数字增加，传给子组件`props`属性变化，触发子组件的`beforeUpdate`、`updated`生命周期。父组件通过`@hook:updated="afterEvent"`会触发`afterEvent`函数。这在处理第三方组件时很有用处，即使第三份组件没有暴露接口，也可以触发一些事件。

## 拓展
这种绑定形式同样可以使用在组件内部动态注册钩子函数。

### 情景
当执行了某操作后需要建立定时器，同时需要在组件销毁时清除定时器，此时可以在生命周期`beforeDestroy`中销毁，原来可能要分开编写。使用这种写法，可以把定时器注册和清除放在一起。


### 代码
```html
<div id="app">
  <div>
    parent component randomNum: {{randomNum}}
  </div>
  <child-node :random-num="randomNum" v-if="flag"></child-node>
  <button @click="flag = !flag">click</button>
</div>
```

```javascript
 // 定义一个名为 child-node 的新组件
  var childNode = {
    props: ['randomNum'],
    data() {
      return {
        num: 0
      }
    },
    template: '<div>child component num: {{ num }}</div>',
    mounted() {
      // 如果参数大于0.5则触发定时器
      if (this.randomNum > 0.5) {
        const timer = setInterval(() => {
          this.num += 1
        }, 1000)
        this.$on('hook:beforeDestroy', () => {
          clearInterval(timer)
          alert('clearInterval')
        })
      } else {
        this.num += 1
      }
    }
  }

  new Vue({
    el: '#app',
    data() {
      return {
        flag: false,
        randomNum: 0
      }
    },
    watch: {
      flag: function (newValue, oldValue) {
        if (newValue) {
          this.randomNum = Math.random()
        }
      }
    },
    components: {
      childNode
    },
  })
```
  
    
具体的hookEvent源码解读可以查看下方的参考链接，就不贴出来了。


参考链接：[hookEvent of Vue](https://juejin.im/post/5dadaf9ef265da5b860140a1)，[alligator.io](https://alligator.io/vuejs/component-event-hooks/)
