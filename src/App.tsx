import BaseExample from "./examples/base";
import StickyExample from "./examples/sticky";
function App() {
  return (
    <>
      <div className='text-center'>
        <b>@phphe/react-base-virtual-list</b>
        <a className='ml-10' href="https://github.com/phphe/react-base-virtual-list">Github</a>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>

          <BaseExample />
        </div>
        <div>
          <StickyExample />
        </div>
      </div >
    </>
  )
}

export default App
