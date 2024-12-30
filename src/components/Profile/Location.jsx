"use client"
import { Fragment, useState } from 'react'
import { Dialog,DialogPanel, DialogTitle,Transition ,TransitionChild } from '@headlessui/react'
import { XMarkIcon, ShoppingCartIcon , ShoppingBagIcon, TrashIcon} from '@heroicons/react/24/outline'
import Link from 'next/link';
import Image from 'next/image';
import { toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import fetchAPI from '@/utils/api';
// import { useDispatch, useSelector } from 'react-redux'

export default function Location({updateLocation}) {
    const [open , setOpen] = useState(false)
    const [addressType, setAddressType] = useState('Home'); // State to keep track of the selected address type
    const [addressVal, setAddressVal] = useState(''); // State to keep track of the selected address type
    const [otherAddress, setOtherAddress] = useState(''); // State to keep track of the custom "Others" address input
    const [defaultVal , setDefaultvalue] = useState(false)
    const [add1 , setAdd1] = useState('')
    const [add2 , setAdd2] = useState('')
    const [pinCode , setPinCode] = useState('')
    const [city , setCity] = useState('')
    const [state , setState] = useState('')
    const [country , setCountry] = useState('India')
    const [locations , setLocations] = useState([]);


    // const {
    //     userInfo,
    //     token,
    //     loading,
    //     error,
    //     } = useSelector((state) => state.auth); 



    const handleAddressTypeChange = (type) => {
      setAddressType(type);
      setAddressVal('')
      if (type !== 'Others') {
        // setAddressType(otherAddress)
        setOtherAddress(''); // Clear the input when selecting non-"Others" types
      }
    };
    // const handleAddressTypeChange = (type) => {
    //   setAddressType(type);
    // };
    const handleDefalutAddValue = (e)=>{ 
        setDefaultvalue(true)

        if (e.target.checked){
            setDefaultvalue(true)
            console.log('checked ')
        }else {
        console.log('uncheckedchecked ')
        setDefaultvalue(false)
            
        }
    }
    

    const updateAddress = async()=>{
        console.log('data -s ', addressVal)
        console.log('add1 -s ', add1)
        console.log('add2 -s ', add2)
        console.log('pinCode -s ', pinCode)
        console.log('dacityta -s ', city)
        console.log('country -s ', country)
        console.log('defaultVal -s ', defaultVal)
        // try {
        //   const response = await toast.promise(
        //     fetchAPI('/vi/profileudpate/locationupdate', {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${token}`,
        //       },
        //       body: JSON.stringify({ addressVal, add1, add2, pinCode , city ,state ,country , defaultVal   }),
        //     }),
        //     {
        //       pending: 'Updating, please wait...',
        //       success: 'Locatin have been successfully updated 👌',
        //       error: 'Failed to update 🤯',
        //     }
        //   );
    
        //   if (response.status === 'success') {
        //     console.log('res - update - ', response);
        //     const newUserInfo = response.userinfo;
            // usertoken.location.push(newUserInfo)
            // usertoken.location = newUserInfo;
            // localStorage.setItem("token", JSON.stringify(usertoken));
            // setUserData(usertoken)
            updateLocation()
            setAddressType('Home')
            setAddressVal('Home')
            setOtherAddress('')
            setDefaultvalue(false)
            setAdd1('')
            setAdd2('')
            setPinCode('')
            setCity('')
            setState('')
            setCountry('India')
            setOpen(false)
        //   }
        // } catch (error) {
        //   console.error('Error updating Locations:', error);
        // }
      }

      
      

  return (
    <>
        
        <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"  
        onClick={()=>setOpen(true)}>
            Create New Address
        </button>
        <Transition show={open} as={Fragment}>
        <Dialog className="relative z-[9999]" onClose={()=>setOpen(false)}>
            <TransitionChild
            as={Fragment}
            enter="ease-in-out duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-400"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full md:pl-10">
                <TransitionChild
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-400"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-400"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                >
                    <DialogPanel className="pointer-events-auto w-screen max-w-md ">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                            <div className="flex items-start justify-between">
                                <DialogTitle className="text-lg font-medium text-gray-900">Add New Address</DialogTitle>
                                <div className="ml-3 flex h-7 items-center">
                                <button
                                    type="button"
                                    className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                    onClick={()=>setOpen(false)}
                                >
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Close panel</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="flow-root">
                                    <label htmlFor="Address1" className="block text-sm my-2 font-medium leading-6 text-gray-900">
                                        Address 1
                                    </label>
                                    <div >
                                        <input
                                        type="text"
                                        value={add1}
                                        onChange={(e)=>setAdd1(e.target.value)}
                                        name="Address1"
                                        id="Address1"
                                        autoComplete="Address1"
                                        className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>

                                    <label htmlFor="Address2" className="block my-2 text-sm font-medium leading-6 text-gray-900">
                                        Address 2
                                    </label>
                                    <div >
                                        <input
                                        type="text"
                                        value={add2}
                                        onChange={(e)=>setAdd2(e.target.value)}
                                        name="Address2"
                                        id="Address2"
                                        autoComplete="Address2"
                                        className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <label htmlFor="pincode" className="block my-2 text-sm font-medium leading-6 text-gray-900">
                                        Pin Code
                                    </label>
                                    <div >
                                        <input
                                        type="text"
                                        value={pinCode}
                                        onChange={(e)=>setPinCode(e.target.value)}
                                        name="pincode"
                                        id="pincode"
                                        autoComplete="pincode"
                                        className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>

                                    <label htmlFor="city" className="block my-2 text-sm font-medium leading-6 text-gray-900">
                                       City
                                    </label>
                                    <div >
                                        <input
                                        type="text"
                                        value={city}
                                        onChange={(e)=>setCity(e.target.value)}
                                        name="city"
                                        id="city"
                                        autoComplete="city"
                                        className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>

                                    <label htmlFor="state" className="block my-2 text-sm font-medium leading-6 text-gray-900">
                                       State
                                    </label>
                                    <div >
                                        <input
                                        type="text"
                                        value={state}
                                        onChange={(e)=>setState(e.target.value)}
                                        name="state"
                                        id="state"
                                        autoComplete="state"
                                        className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>

                                    <label htmlFor="country" className="block my-2 text-sm font-medium leading-6 text-gray-900">
                                    Country
                                    </label>
                                    <div >
                                        <input
                                        type="text"
                                        value={country}
                                        onChange={(e)=>setCountry(e.target.value)}
                                        name="country"
                                        id="country"
                                        autoComplete="country"
                                        className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>

                                    <label htmlFor="TOAddress" className="block my-2 text-sm font-medium leading-6 text-gray-900">
                                    Type of Address
                                    </label>
                                    

                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => {handleAddressTypeChange('Home')
                                                setAddressVal('Home')
                                            }}
                                            className={`flex items-center px-4 py-2 border rounded-md ${
                                            addressType === 'Home'
                                                ? 'bg-orange-100 border-orange-500 text-orange-600'
                                                : 'bg-white border-gray-300 text-gray-500'
                                            }`}
                                        >
                                            <span className="mr-2">🏠</span> Home
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {handleAddressTypeChange('Work')
                                                setAddressVal('Work')
                                            }}
                                            className={`flex items-center px-4 py-2 border rounded-md ${
                                            addressType === 'Work'
                                                 ? 'bg-orange-100 border-orange-500 text-orange-600'
                                                : 'bg-white border-gray-300 text-gray-500'
                                            }`}
                                        >
                                            <span className="mr-2">💼</span> Work
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAddressTypeChange('Others')}
                                            className={`flex items-center px-4 py-2 border rounded-md ${
                                            addressType === 'Others'
                                                 ? 'bg-orange-100 border-orange-500 text-orange-600'
                                                : 'bg-white border-gray-300 text-gray-500'
                                            }`}
                                        >
                                            <span className="mr-2">📍</span> Others
                                        </button>
                                        </div>
                                        {/* "Others" Input Field */}
                                        {addressType === 'Others' && (
                                        <div className="mt-2 flex items-center space-x-2">
                                            <input
                                            type="text"
                                            value={addressVal}
                                            onChange={(e) => setAddressVal(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                            placeholder="Eg: Dad's, Friend's etc"
                                            />
                                            <button
                                            type="button"
                                            // onClick={() => setOtherAddress('')}
                                            onClick={() => {handleAddressTypeChange('Home')
                                                setAddressVal('Home')
                                            }}

                                            className="text-gray-500 hover:text-gray-700"
                                            >
                                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                            <span className="sr-only">Clear input</span>
                                            </button>
                                        </div>
                                        )}
                                    <div className='mt-5'>
                                    <input
                                        name='setDefaultvalue'
                                        value='true'
                                        type="checkbox"
                                        onChange={handleDefalutAddValue}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    <span className='ml-2'> Make this My Default Address</span>
                                    </div>

                                    <div className="mt-6 flex items-center justify-end gap-x-6">
                                    <button
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    onClick={updateAddress}
                                    >
                                    Update
                                    </button>
                                </div>
                                </div>
                            </div>
                        </div>

                       
                    </div>
                    </DialogPanel>
                </TransitionChild>
                </div>
            </div>
            </div>
        </Dialog>
        </Transition>
    </>
    
  )
}



const slugify = (text) => {
    return text
      .replace(/\s+/g, "-") // Replace spaces with dashes
  // Trim dashes from the beginning and end
  };