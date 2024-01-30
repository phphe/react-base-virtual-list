import { useMemo } from 'react'
import { VirtualList, } from './VirtualList'
import exampleData from './example_data.json'

function App() {
  return (
    <>
      <b>@phphe/react-base-virtual-list</b> on <a href="https://github.com/phphe/react-base-virtual-list">Github</a>
      <div>
        <h1>Virtual List Demo</h1>
        <ul>
          <li>Dynamic, the list items are not the same height.</li>
          <li>1000 items in the demo.</li>
        </ul>
        <div>
          <VirtualList
            items={exampleData}
            style={{ height: '600px', width: '600px', border: '1px solid #ccc', padding: '10px' }}
            renderItem={(item, index) => <div key={index} style={{ marginBottom: '10px' }}>
              <h3>{index}. {item.headline}</h3>
              <div>
                <div style={{ float: 'left', width: '100px', height: '100px', background: '#f0f0f0', borderRadius: '5px', marginRight: '10px' }}></div>
                {item.content}
              </div>
            </div>}
          ></VirtualList><a href="https://github.com/phphe/react-base-virtual-list/blob/main/src/App.tsx">Source Code</a>
        </div>
      </div >
    </>
  )
}

export default App
