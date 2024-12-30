import Link from 'next/link'
import React from 'react'

const PageHead = ({title}) => {
  return (
    <>
       <div className="bg-gradient-to-r from-[#8B6D4D] to-[#517B54] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            {title}
          </h1>
        </div>
      </div>
    </>
  )
}

export default PageHead