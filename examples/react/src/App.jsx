import React, { memo } from 'react'
import './app.scss'

import Home from './views/Home'

const App = memo(() => {
  return (
    <div>
      <h2>App</h2>
      <div className="content">App Content</div>
      <Home />
    </div>
  )
})

export default App