import BaseExample from "./examples/base";
import StickyExample from "./examples/sticky";
import ScrollToIndexExample from "./examples/scrollToIndex";

function App() {
  return (
    <>
      <div className='text-center'>
        <b>@phphe/react-base-virtual-list</b>
        <a className='ml-10' href="https://github.com/phphe/react-base-virtual-list">Github</a>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        <div>
          <BaseExample />
        </div>
        <div>
          <StickyExample />
        </div>
        <div>
          <ScrollToIndexExample />
        </div>
      </div >
    </>
  )
}

export default App
