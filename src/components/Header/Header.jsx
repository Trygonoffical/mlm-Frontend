import React from 'react'

import Navbar from './Navbar'
import Menu from './Menu'
import TopBar from './TopBar'

const Header = () => {
  return (
    <>
     <header >
       <TopBar />
        <Navbar />
        <Menu />
     </header>
    </>
  )
}

export default Header