# 前言

给 Canvas 中的元素绑定事件实际上是 [ZRender](https://ecomfe.github.io/zrender-doc/public/) 实现的，因为我一开始是从 ECharts 中看见的就用了这个标题。。知道 ZRender 的人都是老司机了应该不会有这个疑问。

以前用过 D3.js 貌似没有这种操作。（刚刚去看了一下文档 [D3.js 的事件处理](https://github.com/d3/d3/blob/master/API.md#handling-events)只有 DOM 和 SVG 元素的。）

# ZRender 绑定事件

就像使用其他一些操作 DOM 库一样使用 `on` 就可以为 Canvas 中的元素绑定事件。

[ZRender 文档 - oneventname-eventhandler-context](https://ecomfe.github.io/zrender-doc/public/api.html#oneventname-eventhandler-context)

例如，创建个圆并绑定点击事件：

```js
// 初始化 ZRender
var zr = zrender.init(document.getElementById('main'));

// 在场景中添加元素
var circle = new zrender.Circle({
    shape: {
        cx: 150,
        cy: 50,
        r: 40
    },
    style: {
        fill: 'none',
        stroke: '#F00'
    }
});
zr.add(circle);

// 为元素绑定事件
circle.on('click', function (e) {
    debugger;
});
```

# 原理

上面的操作好骚啊，那么到底是怎么实现的呢？众所周知 Canvas 和 SVG 不同她只能拿来画东西，事件只能绑定到这个画板上。

简单来说就是：

1.  将事件绑定到普通 DOM 元素，代理 Canvas 中的元素（简称： “C 元素” 吧）接收事件
2.  在创建 “C 元素” 时保存这个 “C 元素” 及其几何信息
3.  使用`on()`方法绑定事件到 “C 元素” 时，将事件监听器的信息保存到 “C 元素”
4.  Canvas 上触发事件时事件冒泡到代理 DOM 上，然后第一步绑定的事件处理函数就开始进行处理：
    1.  计算事件对象对应在 Canvas 中的坐标
    2.  依次判断 “C 元素” 是否触发这个事件（根据 “C 元素” 是否包含上面计算的坐标判断）

更简单说就是：保存 Canvas 中的元素的几何信息，使用普通 DOM 元素接收事件对象，然后根据保存的几何信息和事件对象判断这个 Canvas 中的元素触不触发这个事件。

其实里面还做了模拟了事件冒泡等很多事情，但我还没有特别深入地去看。。

# 读下源码

## 确认版本

```text
zjf@DESKTOP-5JD9B9T MINGW64 ~/Documents/GitHub/zrender (master)
$ git log
commit e2086ad7e5500aa01ef257b884292fe4e5167cba (grafted, HEAD -> master, origin/master, origin/HEAD)
Author: Ovilia <zwl.sjtu@gmail.com>
Date:   Wed Jul 3 17:05:41 2019 +0800

    fix(svg): text truncate bug with treemap
```

## 绑定个点击事件试试

```js
// ~/test/event.html
var zr = zrender.init(document.getElementById('main'));
var circle1 = new zrender.Circle({
    shape: {
        cx: 20,
        cy: 20,
        r: 30
    },
    style: {
        fill: 'blue'
    },
    draggable: true
});

circle1.on('click', function (e) {
    debugger; // line 25
});
```

## 查看点击事件触发的调用栈

```text
(anonymous) (event.html:25)
trigger (Eventful.js:143)
dispatchToElement (Handler.js:239)
Handler.<computed> (Handler.js:351)
trigger (Eventful.js:143)
domHandlers.<computed> (HandlerProxy.js:231)
(anonymous) (HandlerProxy.js:259)
```

从代理元素接收到事件，经过 7 次函数调用就调用到了 “C 元素” 的点击事件处理函数。

### `(anonymous) (HandlerProxy.js:259)`

首先代理元素（包裹 Canvas 的普通 DOM 元素）接收到了事件，实际上这个匿名事件处理函数真正绑定到代理元素上是在 [`~/scr/core/event.js:255`](https://github.com/ecomfe/zrender/blob/e2086ad7e5500aa01ef257b884292fe4e5167cba/src/core/event.js#L255) 这行代码完成的。

### `Handler.<computed> (Handler.js:324)`（重点来了）

真正的判断这个 “C 元素” 是否应触发点击事件是从调用 `findHover()` 函数开始，调用栈如下

```text
containPath (path.js:206)
contain (path.js:390)
contain (Path.js:252)
isHover (Handler.js:356)
findHover (Handler.js:281)
Handler.<computed> (Handler.js:324)
trigger (Eventful.js:143)
domHandlers.<computed> (HandlerProxy.js:231)
(anonymous) (HandlerProxy.js:259)
```

为什么会有这么多层调用呢？这是为了提升效率，先判断一下点是否在外接矩形里，如果在外接矩形里再继续判断是否在多边形里，不在外接矩形里就直接过了。

### (anonymous) (event.html:25)

经过上面的一系列判断，确定这个 “C 元素” 应该触发这个点击事件，然后调用这个 “C 元素” 的点击事件处理函数，这一系列骚操作就完成了，可喜可贺。
