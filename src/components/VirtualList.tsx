import React, {
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  ReactNode,
  createContext,
} from 'react'

export function VirtualList(
  props,
) {
  const buffer = props.buffer || 100
  let scrollTop = 0
  const itemSize = props.itemSize || 100
  let listSize = props.listSize || 1000
  const count = props.items.length
  const list = useRef(null);
  const [visible, setvisible] = useState([]);
  const [listInnerStyle, setlistInnerStyle] = useState(() => ({}));
  const prevScrollTop = useRef(0);
  const created = useRef(false);
  // 
  const update = () => {
    if (created.current) {
      scrollTop = list.current!.scrollTop
      listSize = list.current!.clientHeight
    }
    const totalSpace = itemSize * count
    let topSpace = scrollTop - buffer
    let bottomSpace = totalSpace - scrollTop - listSize - buffer
    let startIndex, endIndex

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
    let listInnerStyle = { paddingTop: `${topSpace}px`, boxSizing: 'border-box' }
    if (bottomSpace < itemSize * 5) {
      listInnerStyle['paddingBottom'] = `${bottomSpace}px`
    } else {
      listInnerStyle['height'] = `${totalSpace}px`
    }
    setvisible(visible)
    setlistInnerStyle(listInnerStyle)
  }
  // on created
  if (!created.current) {
    update()
    created.current = true;
  }
  const handleScroll = () => {
    scrollTop = list.current!.scrollTop
    if (Math.abs(prevScrollTop.current - scrollTop) > itemSize) {
      update()
      prevScrollTop.current = scrollTop
    }
  }
  // 
  useEffect(() => {
    update()
  }, []);
  // 
  return <div ref={list} onScroll={handleScroll} style={{ height: '500px', overflow: 'auto', }}>
    <div style={listInnerStyle}>
      {visible.map((item, i) => <div key={item.id}>{item.text}</div>)}
    </div>
  </div>
}