import { useMemo } from 'react'
import './App.css'
import { VirtualList, } from './components/VirtualList'

function App() {
  const items = useMemo(
    () =>
      new Array(1000).fill(1).map((v, i) => ({
        id: i,
        text: 'Item ' + i,
        lineHeight: 20 + (i % 20) + 'px',
        width: 100 + (i % 30) + 'px',
      })),
    [],
  )

  const styles = {
    node: {
      border: '1px solid #ccc',
    },
  }
  return (
    <div>
      <div>
        <h1>vertical</h1>
        <VirtualList
          items={items}
          style={{ height: '600px' }}
        ></VirtualList>
      </div>
    </div>
  )
}

export default App
