import Link from 'next/link'
import React from 'react'

const Menu = () => {
  return (
    <div className='hidden md:block w-full bg-[#FCF4E7]'>
        <div className='mx-auto flex max-w-7xl py-2 px-4 lg:px-8 space-x-4'>
            <Link href='#'>Menu</Link>
            <Link href='#'>Menu</Link>
            <Link href='#'>Menu</Link>
            <Link href='#'>Menu</Link>
            <Link href='#'>Menu</Link>
            <Link href='#'>Menu</Link>
        </div>
    </div>
  )
}

export default Menu