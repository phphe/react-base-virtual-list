import React, {
  useState,
  useMemo, useRef, ReactNode, useLayoutEffect, useImperativeHandle
} from 'react';

// fix forwardRef type for generic types. refer: https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
export type FixedForwardRef = < T, P = {} > (
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
) => (props: P & React.RefAttributes<T>) => React.ReactElement | null;
const forwardRef = React.forwardRef as FixedForwardRef

export type VirtualListProps<ITEM> = {
  /**
   * Estimated average size of each list item.
   */
  itemSize?: number,
  /**
   * render space = list visible space + buffer x 2
   */
  buffer?: number,
  /**
   * List of items to render.
   */
  items: ITEM[],
  /**
   * Render function for each list item.
   */
  renderItem: (item: ITEM, index: number) => ReactNode,
  /**
   * These items won't be removed when scroll. You can use css 'position:sticky' make them sticky.
   */
  persistentIndices?: number[], // index[]
  /**
   * Minimum distance for triggering a calculation when scrolling.
   */
  triggerDistance?: number,
  /**
   * listen to scroll event.
   */
  onScroll?: React.UIEventHandler<HTMLElement>,
  /**
   * Insert elements at the head. Recommended to only insert elements that do not take up space or take very little space, such as position absolute.
   */
  renderHead?: () => ReactNode,
  /**
   * Insert elements at the foot. Recommended to only insert elements that do not take up space or take very little space, such as position absolute.
   */
  renderFoot?: () => ReactNode,
  className?: string,
  style?: React.CSSProperties,
  innerClassName?: string,
} & Partial<typeof defaultProps>

export const defaultProps = {
  /**
   * The visible space of the list. It is only used before DOM created(SSR).
   */
  listSize: 1000,
  /**
   * Whether to enable the virtual list feature.
   */
  virtual: true,
}

export interface VirtualListHandle {
  scrollToIndex(index: number, block?: 'start' | 'end' | 'center' | 'nearest'): void
  getRootElement(): HTMLElement
  forceUpdate(): void
}

export const VirtualList = forwardRef(function <ITEM>(
  props: VirtualListProps<ITEM>,
  ref: React.ForwardedRef<VirtualListHandle>
) {
  const [itemSize, setItemSize] = useState(props.itemSize || 100);
  const buffer = useMemo(() => props.buffer || Math.max(itemSize * 5, 100), [props.buffer, itemSize]);
  const count = props.items.length
  const list = useRef<HTMLDivElement>(null);
  const listInner = useRef<HTMLDivElement>(null);
  const prevScrollTop = useRef(0);
  const scrollToIndexRef = useRef<{ index: number, block: string }>();
  const [shouldScrollToIndex, setShouldScrollToIndex] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [listSize, setListSize] = useState(props.listSize!);
  const [forceRerender, setForceRerender] = useState([]); // change value to force rerender
  const ignoreUpdateScrollTopOnce = useRef(false);
  // 
  const mainCache = useMemo(() => {
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
    if (!props.virtual) {
      startIndex = 0
      endIndex = count
    }
    const mainVisibleIndices = Array.from({ length: endIndex - startIndex }, (_, index) => index + startIndex);
    let visibleIndices = mainVisibleIndices.concat(props.persistentIndices || [])
    if (props.persistentIndices?.length) {
      visibleIndices = [...new Set(visibleIndices)].sort((a, b) => a - b)
    }
    const visible = visibleIndices.map(i => props.items[i])
    return { visible, visibleIndices, topSpace, bottomSpace, totalSpace }
  }, [props.items, itemSize, count, scrollTop, buffer, listSize, props.virtual, props.persistentIndices]);
  const { visible, visibleIndices, topSpace, bottomSpace, totalSpace } = mainCache

  // 
  const listInnerStyle: any = { paddingTop: `${topSpace}px`, boxSizing: 'border-box' }
  if (bottomSpace < itemSize * 5) {
    listInnerStyle['paddingBottom'] = `${bottomSpace}px`
  } else {
    listInnerStyle['height'] = `${totalSpace}px`
  }

  useLayoutEffect(() => {
    // list may be null in test environment
    if (!list.current) {
      return
    }
    setListSize(list.current.clientHeight)
    // get avg item size
    if (props.itemSize == null) {
      // get gap
      const listInnerEl = listInner.current as HTMLElement
      let gap = parseFloat(getComputedStyle(listInnerEl).rowGap)
      gap = isNaN(gap) ? 0 : gap
      // 
      let count = 0
      let totalHeight = 0
      const persistentIndices = new Set(props.persistentIndices || [])
      let i = -1
      for (const el of listInnerEl.children) {
        i++
        if (persistentIndices.has(visibleIndices[i])) {
          continue
        }
        const style = getComputedStyle(el)
        if (style.display === 'none') {
          continue
        }
        if (style.position !== 'static' && style.position !== 'relative') {
          continue
        }
        totalHeight += (el as HTMLElement).offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom) + gap
        count++
      }
      setItemSize(totalHeight / count)
    }
  }, [props.itemSize, props.items, forceRerender]);
  //

  const handleScroll = function (event: unknown) {
    if (!props.virtual) {
      return
    }
    if (scrollToIndexRef.current) {
      return
    }

    setListSize(list.current!.clientHeight)

    if (ignoreUpdateScrollTopOnce.current) {
      ignoreUpdateScrollTopOnce.current = false
    } else {
      const scrollTop = list.current!.scrollTop;
      if (Math.abs(prevScrollTop.current - scrollTop) > (props.triggerDistance ?? itemSize)) {
        setScrollTop(scrollTop)
        prevScrollTop.current = scrollTop
      }
    }
    // @ts-ignore
    props.onScroll?.call(this, event)
  }
  // 
  useImperativeHandle(ref, () => ({
    scrollToIndex(index, block = 'start') {
      scrollToIndexRef.current = {
        index,
        block
      }
      const scrollTop = index * itemSize // estimated value
      list.current!.scrollTop = scrollTop
      setScrollTop(scrollTop)
      prevScrollTop.current = scrollTop
      setShouldScrollToIndex([]) // ensure re-render but exclude itemSize. setForceRerender will re calculate avg itemSize, so don't use it here.
    },
    getRootElement() {
      return list.current!
    },
    forceUpdate() {
      setForceRerender([])
    },
  }), [itemSize]);
  // scrollToIndex
  useLayoutEffect(() => {
    if (scrollToIndexRef.current) {
      const { index, block } = scrollToIndexRef.current;
      scrollToIndexRef.current = undefined
      const indexInVisible = visibleIndices.indexOf(index)
      const el = listInner.current!.children[indexInVisible] as HTMLElement
      if (el) {
        // @ts-ignore
        el.scrollIntoView({ block })
        ignoreUpdateScrollTopOnce.current = true
      }
    }
  }, [shouldScrollToIndex])
  // use ResizeObserver listen list size change
  useLayoutEffect(() => {
    const { ResizeObserver } = window
    const observer = ResizeObserver && new ResizeObserver(() => {
      setListSize(list.current!.clientHeight)
    })
    // observer is undefined in test environment
    observer?.observe(list.current as HTMLElement)
    return () => {
      observer?.disconnect()
    }
  }, [])
  // 
  return <div ref={list} onScroll={handleScroll} className={props.className} style={{ overflow: 'auto', ...props.style }}>
    {props.renderHead?.()}
    <div ref={listInner} className={props.innerClassName} style={{ display: 'flex', flexDirection: 'column', ...(props.virtual && listInnerStyle) }}>
      {visible.map((item, i) => props.renderItem(item, visibleIndices[i]))}
    </div>
    {props.renderFoot?.()}
  </div>
})

// @ts-ignore
VirtualList.defaultProps = defaultProps
