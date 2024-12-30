"use client"
import CustomerAddress from '@/components/Profile/CustomerAddress'
import CustomerProfile from '@/components/Profile/CustomerProfile'
import { Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import {  ArrowDownIcon, InboxArrowDownIcon, ListBulletIcon, MapPinIcon, Square2StackIcon, TicketIcon, TruckIcon, UserIcon, WalletIcon } from '@heroicons/react/24/outline'
import { ShoppingBagIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useEffect } from 'react'
import { ToastContainer , toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
const Account = () => {
  
  return (
    <>
        <section className='mx-auto max-w-7xl lg:px-8 py-8'>
            {/* <h2 className='text-2xl font-semibold py-4 text-center'>My Account</h2> */}
            <div >
                <TabGroup vertical className='md:grid md:grid-cols-4 gap-2 p-4'>
                    {/* <div className="leftsec bg-gray-200 p-4 rounded-sm"> */}
                        <TabList className='flex justify-center md:justify-start md:flex-col  p-2'>
                            <Tab className='py-4 flex justify-between px-2 mr-5 md:mr-0 border-b-2 border-gray-200  ui-selected:bg-gray-800 ui-selected:text-white ui-not-selected:bg-white ui-not-selected:text-black items-center'>
                                <span className='flex justify-start items-center'>

                                <UserIcon className='w-8 h-8 mr-1' />
                                My Profile 
                                </span>
                                <ArrowRightIcon className='hidden md:block w-4 h-4 mr-1' />
                                <ArrowDownIcon className='md:hidden w-4 h-4 ml-1' />
                            </Tab>
                            <Tab className='py-4 flex justify-between px-2 border-b-2 border-gray-200  ui-selected:bg-gray-800 ui-selected:text-white ui-not-selected:bg-white ui-not-selected:text-black items-center'>
                                <span className='flex justify-start items-center'>

                                <InboxArrowDownIcon className='w-8 h-8 mr-1' />
                                My Order 
                                </span>
                                <ArrowRightIcon className='hidden md:block w-4 h-4 mr-1' />
                                <ArrowDownIcon className='md:hidden w-4 h-4 ml-1' />
                            </Tab>
                            
                        </TabList>
                    {/* </div>
                    <div className="col-span-3 bg-gray-200  p-4"> */}
                        <TabPanels className='p-4 py-10 border border-slate-100 col-span-3 '>
                            <TabPanel>
                                <CustomerProfile />
                                <hr className='my-10' />
                                <CustomerAddress />
                            </TabPanel>
                            <TabPanel>
                            <h2 className='text-center'>Oh-No! <br />

                            Nothing To See Here</h2>
                            <div className='text-center py-10'>
                                <ShoppingBagIcon className='w-28 h-28 mx-auto pb-5' />
                                <Link href='/shop' className='bg-gray-900 text-white rounded-sm px-4 py-2'>Continue Shopping</Link>
                            </div>
                            </TabPanel>
                        </TabPanels>
                    {/* </div> */}
                
                </TabGroup> 
            </div>
        </section>
        <ToastContainer />
    </>
  )
}

export default Account