# react-base-virtual-list ![GitHub License](https://img.shields.io/github/license/phphe/react-base-virtual-list) ![NPM Version](https://img.shields.io/npm/v/react-base-virtual-list) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/phphe/react-base-virtual-list/build.yml) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-base-virtual-list)

[中文](README_CN.md)

React basic virtual list, supports common features and is easy to customize. [Online Demo](https://phphe.github.io/react-base-virtual-list/)

## Features

- Supports common features and is easy to customize. Check [Development](#development).
- Supports lists with fixed height or dynamic height items.
- High performance. For lists with different item heights, it does not retrieve the height of each item.
- Formats of exported files: typescript, cjs, esm, iife, iife source map. iife can be use by `script` tag in browser, see [IIFE](#iife).

## Installation

- npm: `npm install react-base-virtual-list`
- yarn: `yarn add react-base-virtual-list`
- pnpm: `pnpm add react-base-virtual-list`
- CDN: Check [iife](#iife).

## Usage

```tsx
import { VirtualList } from "react-base-virtual-list";

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

## props (required)

- `items`: `Array`. List data.
- `renderItem`: `(item, index: number) => ReactNode`. Rendering function for each item in the list. Index is the index of the list item in the whole list.

## props (optional)

- `itemSize`: `number`. Estimated height of a single item in the list.
- `buffer`: `number`. Additional space outside the visible area of the virtual list to render.
- `persistentIndices`: `number[]`. Array of indices of items to be persistently rendered. This keeps the corresponding items rendered continuously without being removed due to being outside the rendering area. You can make them sticky by using CSS `position:sticky`.
- `listSize`: `number`, default: 1000. Height of the visible area of the list. Only used before DOM creation, suitable for SSR.
- `triggerDistance`: `number`. The min distance to trigger re-rendering when scrolling.
- `onScroll`: `React.UIEventHandler`. Listen for the list's scroll event. Type is same with HTML native onscroll handle.
- `virtual`: `boolean`. default: `true`. Whether to enable the virtual list feature. Render all items if disabled.
- `renderHead`: `() => ReactNode`. Customize the persistent rendering content of the list header. Suitable for absolutely positioned, fixed positioned elements, and elements that do not take up too much space.
- `renderFoot`: `() => ReactNode`. Customize the persistent rendering content of the list footer. Suitable for absolutely positioned, fixed positioned elements, and elements that do not take up too much space.
- `className`: `string`. Add a CSS class to the list root element.
- `style`: `React.CSSProperties`. Add CSS styles to the list root element.
- `innerClassName`: `string`. Add a CSS class to the list inner element.

## Exposed Methods

First, use `ref` to obtain the exposed object.

```tsx
import { useRef } from "react";
import { VirtualList, VirtualListHandle } from "react-base-virtual-list";

export default function BaseExample() {
  const ref = useRef<VirtualListHandle>(null);
  return (
    <>
      <VirtualList ref={ref}></VirtualList>
    </>
  );
}
```

Irrelevant parts are omitted in the above code. `VirtualListHandle` is a `typescript` type, please ignore it if you are using pure JS.

`VirtualListHandle` type code.

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

Then use the `ref` object to access the exposed methods.

- `scrollToIndex`: `(index:number, block = 'start'):void`. Scroll to the specified index position. `block` is equal to the `block` option of the HTML native method `scrollIntoView`.
- `getRootElement`: Get list HTML element。
- `forceUpdate`: Forcefully re-render the list. This can be called after the visible area of the list changes.

## Note

- Remember to set the height of the list. Class, style, px, em, percentage, etc. are all acceptable.
- Delayed loading, loading when scrolling to the bottom, etc. can be implemented using the exposed `onScroll`.

## IIFE

The `dist/index.iife.js` file can be run in the browser.
You can host it on your server and then use the `script` tag to include it. Before including it, you also need to include `react`, `react-dom`. The global variable exposed by this file is `reactBaseVirtualList`, you can access all the exports of this file through `window.reactBaseVirtualList`, and get the main component exported through `window.reactBaseVirtualList.VirtualList`.

You can also use the following third-party CDN url to include it.

- unpkg: https://unpkg.com/react-base-virtual-list
- jsdelivr: https://cdn.jsdelivr.net/npm/react-base-virtual-list

## Development

- `lib`: The main files, also the files that are packaged into the library. Running `npm run build` will package the files in this directory into the `dist` folder. The corresponding Vite configuration file is `vite.build.ts`.
- `src`: The files used for development and debugging. Running `npm run dev` will run the code in this directory in the browser. Running `npm run build:web` will package the code in this directory into the `dist` folder. The corresponding Vite configuration file is `vite.config.ts`.
- `uno.config.ts`: [unocss](https://github.com/unocss/unocss) configuration file. `unocss` only works in the `src` folder. With the current configuration, you can use `Tailwindcss` style class names.
- `.github/workflows/build.yml`: Some automated actions performed when publishing to GitHub. You can delete or modify it.

## Changelog

https://github.com/phphe/react-base-virtual-list/releases
