# @phphe/react-base-virtual-list

[English](README.md)

React 基础虚拟列表。[在线示例](TODO)

## 特点

- 支持每项高度不同的列表。
- 简单易扩展，只含有常见功能。
- 高性能。针对每项高度不同的列表，不会获取每项的高度。

## 安装

```sh
npm install @phphe/react-base-virtual-list --save
```

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
  forceUpdate(): void;
}
```

然后使用获取到的`ref`对象操作暴露的方法。

- `scrollToIndex`: `(index:number, block = 'start'):void`. 滚动到指定索引位置。`block`等于 HTML 原生方法`scrollIntoView`的`block`选项。
- `forceUpdate`: 强制重新渲染列表。可以再列表可见区域变换后调用此方法。

## 注意点

- 记得给列表设置高度。class, style, px, em, 百分比等都可以。