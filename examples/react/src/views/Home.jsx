import React, { memo } from 'react'
import './home.scss'

const Home = memo(() => {
  return (
    <div>
      <h2>Home</h2>
      <div className="content">Home Content</div>
    </div>
  )
})

export default Home