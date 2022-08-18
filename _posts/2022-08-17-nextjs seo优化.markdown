---
layout: post
title: next seo
date: 2022-08-17 18:14:30 +0300
description: next中seo实现避坑指北
img: 2022-08-17/nextjs-logo.png
tags: [next,seo.swr]
---

1. 想不出标题
  入职新公司以来，主要是负责新业务线的官网页面与后台管理系统。  
  因为是官网，所以seo自然是必不可少的，而公司的前端技术栈，基本都是react+typescript，so，新的官网选择的是nextjs。  

2. 实现搭配  
  nextjs + typescript + useSwr + react context  
  nextjs 与 typescript 已经是固定搭配了，useSwr呢则是官方推荐的请求库，在考察之后，果断也是选用了这个包。官网项目并不复杂，context也足够使用。
  swr官方地址：[https://swr.vercel.app/zh-CN](https://swr.vercel.app/zh-CN)  （“SWR” 这个名字来自于 stale-while-revalidate：一种由 HTTP RFC 5861 推广的 HTTP 缓存失效策略。这种策略首先从缓存中返回数据（过期的），同时发送 fetch 请求（重新验证），最后得到最新数据。）

3. 动态数据的ssr实现  
  在nextjs上实现方式很清晰。  
  使用getServerSideProps，在服务器端先获取需要预渲染的数据。通过props传到页面内。服务器端预渲染时，等于是渲染静态页面一般。
  实现起来简单，但是在数据交互上就有点麻烦了。这个的问题在于，通过props传到顶级的页面组件，再一层层传到使用的地方，则显得过于笨拙。    
  so，使用swr吧。 
  与nextjs的搭配使用：[https://swr.vercel.app/zh-CN/docs/with-nextjs](https://swr.vercel.app/zh-CN/docs/with-nextjs)  
  当了解了搭配使用的方法后，这里着重说一下swr的key，以及什么样的接口用什么样的key。  
  key的类型:    
  ![swr key](../assets/img/2022-08-17/swr-key.jpeg)    
    * string：这种适合请求固定的配置项，一次请求，在该次网页的生命周期中能重复使用。
    * ArgumentsTuple：以数组存储key，数组长度大于等于1，第一位可以放置path，后续可以放置请求参数的值，这里最好是参数个数固定，且较少，不然放进去都不知道标记的什么含义。  
    * Record<any, any>：以对象存储key，对象中含有object[key]=path，其他属性的可以根据该接口的参数对象解构合并。
    * null / undefined / false : 返回 这三个值则此次不发送请求
    * 如果key是一个函数，则函数的返回值遵从上述的逻辑    
      
    这次踩的坑就是，在getServerSideProps，使用对象做key，而客户端第一次渲染时，key为函数返回的值与props.fallback的key不同（这很大程度时我写的代码问题😭）。  
    因为该项目的首屏渲染与url上的参数有关，在getServerSideProps中，是直接通过context取出query使用。而在react代码中，初始化项目，将参数收集到context后，再由组件取出来消费，这样导致第一次渲染，封装request的hook并不能直接拿到url的参数（用的默认值 or undefined），导致在swr中生成的对象key，与在getServerSideProps中生成的不一致，取不到预请求的数据，从而输出的html中没有动态数据那一块。  
    
    ```javascript
    // getServerSideProps中
    {
      fallback: {
        [unstable_serialize({
          key: path.key,
          ...(params as GetDataParams),
        })]: hotArea,
      },
    }

    // 定义的request Hook
    export const useData = (params: GetDataParams) => {
      const notRequest = isNil(params.aaa);
      const { data, error } = useSWR(() => {
        // 当参数不满足条件时，返回false
        if (notRequest) return false;
        return { key: path.key, ...params };
      }, getHotBuildingList);
      return {
        data,
        loading: getLoading(notRequest, data),
        error,
      };
    }
    ```
    解决方法：所以如果你的request hook的请求参数依赖与其他的hook，建议给该hook一个initialParams，保证这个值生成的key能在props.fallback中获取到数据。
    ```javascript
    // 定义的request Hook
    export const useData = initPageSeoRequest((params: GetDataParams) => {
      const notRequest = isNil(params.aaa);
      const { data, error } = useSWR(() => {
        // 当参数不满足条件时，返回false
        if (notRequest) return false;
        return { key: path.key, ...params };
      }, getHotBuildingList);
      return {
        data,
        loading: getLoading(notRequest, data),
        error,
      };
    })


    /**
    * 对需要seo的动态内容需要包裹一层
    * @description 服务器端：服务初始化后这里的闭包会一直存在，服务器端只有的对页面的第一次请求是使用initialParams，后续同样会使用params，导致参数错误
    * 所以需要区分一下，服务器端一定是使用initialParams 来初始化页面
    * @param fn 获取数据的函数
    * @returns 动态数据
    */
    const initPageSeoRequest = <T, D>(fn: (params: T) => D) => {
      let init = false;
      return (params: T, initialParams: T): D => {
        const data = isBrowser() ? (init ? params : initialParams) : initialParams;
        init = true;
        return fn(data);
      };
    };
    export default initPageSeoRequest;
    ```

4. 结  
  最后呢，官网终于可以完整的直出带有动态数据的网页了，虽然同事们看不出效果，老板也不加鸡腿，但是问题不大，小照好棒好棒好棒。