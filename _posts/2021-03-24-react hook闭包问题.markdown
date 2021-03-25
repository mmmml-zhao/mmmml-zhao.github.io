---
layout: post
title: react hook闭包问题
date: 2021-03-24 17:29:30 +0300
description: 项目遇到问题记录。
img: 2021-03-24/react.svg
tags: [react]
---  

昨天在编写react时发现了一件怪事，在useEffect内的定时器里的函数无法访问最新的state里的值，遇到这个问题第一反应当然是函数执行时因为闭包里引用的刚开始定义是的值，所以没更新，于是对函数进行useCallBack，把函数内所有用上的依赖定义上。
```typescript
const TipModal = () => {
  const [progress, setProgress] = useState(0);
  const [type, setType] = useState("a");
  const [isTimer, setIsTimer] = useState(null);

  const add = useCallback(() => {
    console.log("progress", progress);
    setProgress((progress) => progress + 1);
  }, [progress]);

  const setTypeFn = () => {
    setType(`b`);
  };

  useEffect(() => {
    console.log("add", add);
    console.log("add progress", progress);
  }, [add]);

  useEffect(() => {
    if (type === "b") {
      if (isTimer) {
        clearInterval(isTimer);
      }
      const timer = setInterval(() => {
        add();
      }, 1000);
      setIsTimer(timer);
    }
  }, [type]);

  return (
    <div>
      {progress}
      <button onClick={setTypeFn}>启动定时器</button>
    </div>
  );
};
```
如上所示，但是在add里打印的progress还是没有变化，但是监听add变化的useEffect里打印的两个值是会变化的，说明闭包依旧存在。  
在论坛求助后，原来是setInterval里依旧存在闭包，那里的add是useCallback返回的最初值。所以要对setInterval要做处理，需要setInterval里永远调用最新的值，根据论坛老哥的说法使用了useRef，代码如下  
[codesandbox代码](https://codesandbox.io/s/tender-gould-4zq16?file=/src/test.js)  

解决方法一： useCallback，将useCallback产生的变量放到useEffect的依赖之中。  
解决方法二： useRef,定时器调用useRef.current,同时每次渲染都把add函数赋给useRef。这样就能保证setInterval,里调用的永远是新的。

