import React, {
  useState,
  useMemo,
  useEffect, useRef, ReactNode, useLayoutEffect, useImperativeHandle,
} from 'react';

type OptionalKeys<T> = {
  [K in keyof T]?: T[K];
};
// fix forwardRef type for generic types. refer: https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
export type FixedForwardRef = < T, P = {} > (
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
) => (props: P & React.RefAttributes<T>) => React.ReactElement | null;
const forwardRef = React.forwardRef as FixedForwardRef

export type Props<ITEM> = {
  itemSize?: number,
  buffer?: number,
  items: ITEM[],
  renderItem: (item: ITEM, index: number) => ReactNode,
  persistentIndices?: number[], // index[]
  className?: string,
  style?: React.CSSProperties,
} & OptionalKeys<typeof defaultProps>

export const defaultProps = {
  listSize: 1000,
}

export interface VirtualListHandle {
  scrollToIndex(index: number, block?: 'start' | 'end' | 'center' | 'nearest'): void
  forceUpdate(): void
}

export const VirtualList = forwardRef(function <ITEM>(
  props: Props<ITEM>,
  ref: React.ForwardedRef<VirtualListHandle>
) {
  const [itemSize, setitemSize] = useState(props.itemSize || 100);
  const buffer = useMemo(() => props.buffer || Math.max(itemSize * 5, 100), [props.buffer, itemSize]);
  const count = props.items.length
  const list = useRef<HTMLDivElement>(null);
  const listInner = useRef<HTMLDivElement>(null);
  const prevScrollTop = useRef(0);
  const scrollToIndexRef = useRef<{ index: number, block: string }>();
  const [scrollTop, setscrollTop] = useState(0);
  const [listSize, setlistSize] = useState(props.listSize!);
  const [forceRerender, setforceRerender] = useState([]); // change value to force rerender
  const ignoreScrollOnce = useRef(false);
  // 
  const totalSpace = itemSize * count
  let topSpace = scrollTop - buffer
  let bottomSpace = totalSpace - scrollTop - listSize - buffer
  let startIndex = 0, endIndex = 0

  if (topSpace <= 0) {
    topSpace = 0
    startIndex = 0
  } else {
    startIndex = Math.floor(topSpace / itemSize)
  }
  if (bottomSpace < 0) {
    bottomSpace = 0
  }
  if (totalSpace <= listSize) {
    endIndex = count
  } else {
    endIndex = count - Math.floor(bottomSpace / itemSize)
  }
  const mainVisibleIndices = Array.from({ length: endIndex - startIndex }, (_, index) => index + startIndex);
  let visibleIndices = mainVisibleIndices.concat(props.persistentIndices || [])
  if (props.persistentIndices?.length) {
    visibleIndices = [...new Set(visibleIndices)].sort((a, b) => a - b)
  }
  const visible = visibleIndices.map(i => props.items[i])

  // 
  const listInnerStyle: any = { paddingTop: `${topSpace}px`, boxSizing: 'border-box' }
  if (bottomSpace < itemSize * 5) {
    listInnerStyle['paddingBottom'] = `${bottomSpace}px`
  } else {
    listInnerStyle['height'] = `${totalSpace}px`
  }

  useLayoutEffect(() => {
    setlistSize(list.current!.clientHeight)
    // get avg item size
    if (props.itemSize == null) {
      let count = 0
      let totalHeight = 0
      const persistentIndices = new Set(props.persistentIndices || [])
      let i = -1
      for (const el of listInner.current!.children) {
        i++
        if (persistentIndices.has(visibleIndices[i])) {
          continue
        }
        const style = getComputedStyle(el)
        totalHeight += (el as HTMLElement).offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom)
        count++
      }
      setitemSize(totalHeight / count)
    }
  }, [props.itemSize, props.items, forceRerender]);
  //
  const handleScroll = () => {
    if (ignoreScrollOnce.current) {
      ignoreScrollOnce.current = false
      return
    }
    setlistSize(list.current!.clientHeight)
    const scrollTop2 = list.current!.scrollTop
    if (Math.abs(prevScrollTop.current - scrollTop2) > itemSize) {
      setscrollTop(scrollTop2)
      prevScrollTop.current = scrollTop2
    } else if (scrollToIndexRef.current) {
      setforceRerender([])
    }
  }
  // 
  useImperativeHandle(ref, () => ({
    scrollToIndex(index, block = 'start') {
      scrollToIndexRef.current = {
        index,
        block
      }
      list.current!.scrollTop = index * itemSize
    },
    forceUpdate() {
      setforceRerender([])
    }
  }), [itemSize]);
  useLayoutEffect(() => {
    if (scrollToIndexRef.current) {
      const { index, block } = scrollToIndexRef.current;
      scrollToIndexRef.current = undefined
      const indexInVisible = visibleIndices.indexOf(index)
      const el = listInner.current!.children[indexInVisible] as HTMLElement
      if (el) {
        // @ts-ignore
        el.scrollIntoView({ block })
        ignoreScrollOnce.current = true
      }
    }
  }, [visibleIndices])
  // 
  return <div ref={list} onScroll={handleScroll} className={props.className} style={{ overflow: 'auto', ...props.style }}>
    <div ref={listInner} style={{ display: 'flex', flexDirection: 'column', ...listInnerStyle }}>
      {visible.map((item, i) => props.renderItem(item, visibleIndices[i]))}
    </div>
  </div>
})

// @ts-ignore
VirtualList.defaultProps = defaultProps