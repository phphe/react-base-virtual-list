# @phphe/react-base-virtual-list ![GitHub License](https://img.shields.io/github/license/phphe/react-base-virtual-list) ![NPM Version](https://img.shields.io/npm/v/@phphe/react-base-virtual-list) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/phphe/react-base-virtual-list/build.yml) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40phphe%2Freact-base-virtual-list)

[English](README.md)

React 基础虚拟列表，实现了常用功能并且易于二次开发。[在线示例](https://phphe.github.io/react-base-virtual-list/)

## 特点

- 实现了常用功能并且易于二次开发，见[开发指南](#开发指南)。
- 支持每项高度固定和不固定的列表。
- 高性能。针对每项高度不同的列表，不会获取每项的高度。
- 导出文件包括格式： typescript, cjs, esm, iife, iife source map. iife 文件供浏览器直接调用，见 [iife](#iife).

## 安装

- npm: `npm install @phphe/react-base-virtual-list`
- yarn: `yarn add @phphe/react-base-virtual-list`
- pnpm: `pnpm add @phphe/react-base-virtual-list`
- CDN: 见 [iife](#iife).

## 使用

```tsx
import { VirtualList } from "@phphe/react-base-virtual-list";

export default function BaseExample() {
  const exampleData = [
    {
      headline: "in magna bibendum imperdiet",
      content: "Praesent blandit. Nam nulla.",
    },
    {
      headline: "non velit donec diam",
      content: "Aenean fermentum.",
    },
  ];
  return (
    <>
      <VirtualList
        items={exampleData}
        style={{ height: "600px", border: "1px solid #ccc", padding: "10px" }}
        renderItem={(item, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <h3>
              {index}. {item.headline}
            </h3>
            <div>
              <div
                style={{
                  float: "left",
                  width: "100px",
                  height: "100px",
                  background: "#f0f0f0",
                  borderRadius: "5px",
                  marginRight: "10px",
                }}
              ></div>
              {item.content}
            </div>
          </div>
        )}
      ></VirtualList>
    </>
  );
}
```

## props(必须的)

- `items`: `Array`. 列表数据。
- `renderItem`: `(item, index: number) => ReactNode`. 列表每项的渲染函数。index 是列表项在整个列表中的索引。

## props(可选的)

- `itemSize`: `number`. 列表单项的估计高度。
- `buffer`: `number`. 虚拟列表可见区域外额外渲染的空间。
- `persistentIndices`: `number[]`. 持久化渲染的项的索引数组。使对应索引的项持续渲染而不会因为在渲染区域外而被删除。你再使用 css 的`position:sticky`就可以使其黏着显示。
- `listSize`: `number`, 默认值: 1000. 列表的可见区域高度。仅用于 DOM 创建前使用，适用于 SSR.
- `triggerDistance`: `number`. 滚动时触发重新渲染的距离。
- `onScroll`: `React.UIEventHandler`. 监听列表的 scorll 事件。类型与 HTML 原生 onscroll 监听器相同。
- `virtual`: `boolean`. 默认`true`. 是否启用虚拟列表。不启用则会渲染全部列表项。
- `renderHead`: `() => ReactNode`. 自定义列表头部持久渲染内容。适用于绝对定位，固定定位元素，和不占用太大空间的元素。
- `renderFoot`: `() => ReactNode`. 自定义列表底部持久渲染内容。适用于绝对定位，固定定位元素，和不占用太大空间的元素。
- `className`: `string`. 附加 css class 到根元素。
- `style`: `React.CSSProperties`. 附加 css style 到根元素。

## 暴露的方法

首先使用`ref`获取暴露的对象。

```tsx
import { useRef } from "react";
import { VirtualList, VirtualListHandle } from "@phphe/react-base-virtual-list";

export default function BaseExample() {
  const ref = useRef<VirtualListHandle>(null);
  return (
    <>
      <VirtualList ref={ref}></VirtualList>
    </>
  );
}
```

上面代码省略了不相关的地方。`VirtualListHandle`是`typescript`类型，纯 js 请忽略。

`VirtualListHandle`类型代码。

```ts
interface VirtualListHandle {
  scrollToIndex(
    index: number,
    block?: "start" | "end" | "center" | "nearest"
  ): void;
  getRootElement(): HTMLElement;
  forceUpdate(): void;
}
```

然后使用获取到的`ref`对象操作暴露的方法。

- `scrollToIndex`: `(index:number, block = 'start'):void`. 滚动到指定索引位置。`block`等于 HTML 原生方法`scrollIntoView`的`block`选项。
- `getRootElement`: 获取列表 HTML 元素。
- `forceUpdate`: 强制重新渲染列表。可以再列表可见区域变换后调用此方法。

## 注意

- 记得给列表设置高度。class, style, px, em, 百分比等都可以。
- 延迟加载，滚动到底部时加载等功能可以靠暴露的`onScroll`实现。

## iife

`dist/index.iife.js`文件可以在浏览器里运行。
你可以托管它到你的服务器，然后使用`script`标签引入。在引入前你还需引入`react`, `react-dom`. 此文件暴露的全局变量是`reactBaseVirtualList`, 你可以通过`window.reactBaseVirtualList`获取此文件的所有导出，通过`window.reactBaseVirtualList.VirtualList`获取导出的主要组件。

你也可以使用如下第三方 CDN 的地址引入。

- unpkg: https://unpkg.com/@phphe/react-base-virtual-list
- jsdelivr: https://cdn.jsdelivr.net/npm/@phphe/react-base-virtual-list

## 开发指南

- `lib`: 主要文件，也是打包成库的文件。运行`npm run build`会打包其中的文件到`dist`目录。对应 vite 配置文件为: `vite.build.ts`.
- `src`: 开发时调试的文件。运行`npm run dev`会在浏览器中运行其中的代码。运行`npm run build:web`会把其中的代码打包到`dist`目录。对应 vite 配置文件为: `vite.config.ts`.
- `uno.config.ts`: [unocss](https://github.com/unocss/unocss) 配置文件。`unocss`仅在`src`文件夹生效。当前配置下，你可以使用`Tailwindcss`风格的`class`名。
- `.github/workflows/build.yml`: 发布到 github 时自动进行的一些操作。你可以删除或者修改。

## 更新日志(changelog)

https://github.com/phphe/react-base-virtual-list/releases
