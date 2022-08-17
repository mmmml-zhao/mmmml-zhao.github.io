---
layout: post
title: next seo
date: 2022-08-17 18:14:30 +0300
description: next中seo实现避坑指北
img: 2022-08-17/nextjs-logo.png
tags: [next,seo.swr]
---

0. 想不出标题的0
入职新公司以来，主要是负责新业务线的官网页面与后台管理系统。  
因为是官网，所以seo自然是必不可少的，而公司的前端技术栈，基本都是react+typescript，so，新的官网页面选择的是nextjs。  

1. 实现搭配  
nextjs + typescript + useSwr   
nextjs 与 typescript 已经是固定搭配了，useSwr呢则是官方推荐的请求库，在考察之后，果断也是选用了这个包。  
swr官方地址：https://swr.vercel.app/zh-CN
  
2. 基础动态数据的ssr实现  
这个在nextjs上实现是简简单单。  
