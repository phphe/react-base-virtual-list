import React, {
  useState,
  useMemo,
  useEffect, useRef, ReactNode
} from 'react';

export type Props<ITEM> = {
  itemSize?: number,
  buffer?: number,
  items: ITEM[],
  renderItem: (item: ITEM, index: number) => ReactNode
} & typeof defaultProps

export const defaultProps = {
  listSize: 1000,
}
export function VirtualList<ITEM>(
  props: Props<ITEM> & React.HTMLProps<HTMLElement>,
) {
  const [itemSize, setitemSize] = useState(props.itemSize || 100);
  const buffer = useMemo(() => props.buffer || Math.max(itemSize * 5, 100), [props.buffer, itemSize]);
  const count = props.items.length
  const list = useRef<HTMLDivElement>(null);
  const listInner = useRef<HTMLDivElement>(null);
  const prevScrollTop = useRef(0);
  const [scrollTop, setscrollTop] = useState(0);
  const [listSize, setlistSize] = useState(props.listSize);

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
  if (totalSpace <= listSize) {
    endIndex = count
  } else {
    endIndex = count - Math.floor(bottomSpace / itemSize)
  }
  if (bottomSpace < 0) {
    bottomSpace = 0
  }
  const visible = props.items.slice(startIndex, endIndex)
  const listInnerStyle: any = { paddingTop: `${topSpace}px`, boxSizing: 'border-box' }
  if (bottomSpace < itemSize * 5) {
    listInnerStyle['paddingBottom'] = `${bottomSpace}px`
  } else {
    listInnerStyle['height'] = `${totalSpace}px`
  }
  useEffect(() => {
    setlistSize(list.current!.clientHeight)
    if (props.itemSize == null) {
      // get avg item size
      let count = 0
      let totalHeight = 0
      for (const el of listInner.current!.children) {
        const style = getComputedStyle(el)
        totalHeight += (el as HTMLElement).offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom)
        count++
      }
      setitemSize(totalHeight / count)
    }
  }, [props.itemSize, props.items]);
  //
  const handleScroll = () => {
    setlistSize(list.current!.clientHeight)
    const scrollTop2 = list.current!.scrollTop
    if (Math.abs(prevScrollTop.current - scrollTop2) > itemSize) {
      setscrollTop(scrollTop2)
      prevScrollTop.current = scrollTop2
    }
  }
  // 
  return <div ref={list} onScroll={handleScroll} className={props.className} style={{ overflow: 'auto', ...props.style }}>
    <div ref={listInner} style={{ display: 'flex', flexDirection: 'column', ...listInnerStyle }}>
      {visible.map((item, i) => props.renderItem(item, i + startIndex))}
    </div>
  </div>
}

VirtualList.defaultProps = defaultProps