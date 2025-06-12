import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='min-h-screen bg-gray-100 p-6'>
        <h1 className='text-3xl font-bold mb-4 text-center'>Expense Tracker</h1>
        {/* <Home /> */}
      </div>
    </>
  )
}

export default App
