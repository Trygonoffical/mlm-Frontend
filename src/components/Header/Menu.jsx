'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchMenuItems();
}, []);

const fetchMenuItems = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/`);
        if (!response.ok) throw new Error('Failed to fetch menu items');
        const data = await response.json();
        console.log('menu' , data)
        setMenuItems(data);
    } catch (error) {
        console.error('Error:', error);
        
    } finally {
        setLoading(false);
    }
};
  return (
    <div className='hidden lg:block w-full bg-[#FCF4E7]'>
        <div className='mx-auto flex max-w-7xl py-2 px-4 lg:px-8 space-x-4 font-semibold' style={{fontSize: "17px"}}>
          <Link href='/shop'>Shop</Link>
          {menuItems && menuItems.map(list=>(
            <Link key={list.position} href={`/category/${list.category_details.slug}`}>{list.category_name}</Link>
          ))}
        </div>
    </div>
  )
}

export default Menu