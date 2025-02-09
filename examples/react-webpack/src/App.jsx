import React, { memo, useState } from 'react'
import './app.css'

import Home from './views/Home.jsx'

const App = memo(() => {
  return (
    <div>
      <h2>App</h2>
      <p>App content</p>
      <Home />
    </div>
  )
})

export default App