'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import CartArea from '../Cart/ShopingCart'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import UserArea from './UserArea'
import ProductSearch from './ProductSearch'

// Important links
const importantLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Shop Now', href: '/shop' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' },
  { name: 'Member Login', href: '/auth/login' },
  // { name: 'Register', href: '/register' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('categories') // 'categories' or 'menu'
  const dispatch = useDispatch();
  const router = useRouter();
  const [productCategories, setProductCategories] = useState([])
  const {
    userInfo,
  } = useSelector((state) => state.auth); 

  const {
    categories,
  } = useSelector((state) => state.home); 
 
  useEffect(() => {
    console.log('header cat values - ', categories.data)
    if (categories && categories.data) {
      setProductCategories(categories.data);
    }
  }, [categories])

  return (
    <>
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8 ">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt="Logo"
              src="/Images/logo.png"
              className="h-16 w-auto"
            />
          </a>
        </div>
        <div className="flex lg:hidden space-x-3">
          <div className='flex space-x-3'>
            <div className="flex items-center cursor-pointer">
              <UserArea />
            </div>
            <div className="flex items-center relative cursor-pointer">
              <CartArea />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <ProductSearch />
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-3">
          <div className="flex items-center cursor-pointer">
            <Link href='/OrderTracking'>
              <Image src='/Images/tracking.png' alt='tracking Icon' width={35} height={35} />
            </Link>
          </div>
          <div className="flex items-center cursor-pointer">
            <UserArea checkoutpage={false} />
          </div>
          <div className="flex items-center relative cursor-pointer">
            <CartArea />
          </div>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="/Images/logo.png"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          
          {/* Mobile Menu Tabs */}
          <div className="flex mt-4 mb-4 border-b">
            <button 
              onClick={() => setActiveTab('categories')}
              className={`flex-1 py-2 text-center ${activeTab === 'categories' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            >
              Categories
            </button>
            <button 
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-2 text-center ${activeTab === 'menu' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            >
              Menu
            </button>
          </div>

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-2 py-6">
              {productCategories && productCategories.length > 0 ? (
                productCategories.map((category) => (
                  <Link
                    key={category.id}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    href={`/category/${category.slug || ''}`}
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">No categories available</div>
              )}
            </div>
          )}

          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div className="space-y-2 py-6">
              {importantLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </DialogPanel>
      </Dialog>
    </>
  )
}