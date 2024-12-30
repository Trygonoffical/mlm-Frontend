"use client"
import { Fragment, useState , useContext, useEffect} from 'react'
import { Dialog,DialogPanel, DialogTitle,Transition ,TransitionChild } from '@headlessui/react'
import { XMarkIcon, ShoppingCartIcon , ShoppingBagIcon, TrashIcon} from '@heroicons/react/24/outline'
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { showCartSidebar, hideCartSidebar, removeItemFromCart } from '@/redux/slices/cartSlice'; // Import actions
import { useRouter } from 'next/navigation';

export default function CartArea() {
    // const {cartCount ,subTotal ,Cart, cartItems , RemoveItemFromCart, showCartSidebar, hideCartSidebar, isCartSidebarVisible  } = useContext(AuthContext);
    // console.log('cart - ', cartItems)
    const router = useRouter();
    const [isCartSidebarVisible , setisCartSidebarVisible]  = useState(false)
    const [subTotal , setsubTotal]  = useState('120')
    // const dispatch = useDispatch();
    // const {
    //     cartCount,
    //     subTotal,
    //     cartItems,
    //     tax,
    //     isCartSidebarVisible,
    //     loading,
    //     error,
    //   } = useSelector((state) => state.cart);

      // Remove Cart Iteam 
    //   const RemoveCartIteam = (itemID , itemAttributes)=>{
    //     dispatch(removeItemFromCart({itemID, selectedAttributes: itemAttributes}))
    //   }
    //   // show cart Sidebar 

    const cartItems = [
        { id: 1, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, img: '/Products/p4.jpeg', qnt: 1 },
        { id: 2, name: 'Collagen Herbal Blend Powder 2', price: 1000, oldPrice: 2000, rating: 5, img: '/Products/p4.jpeg' ,qnt: 3  },
    ]
      const showCartSidebarStatus = () =>{
        setisCartSidebarVisible(true);
      }
    //   // hide CartSidebar 
      const hideCartSidebarStatus = ()=>{
        // console.log('vvvv')
        setisCartSidebarVisible(false);

      }
  return (
    <>
        
        <button className="group flex items-center p-2"  onClick={()=>showCartSidebarStatus()}>
            {/* <ShoppingBagIcon
                className="h-6 w-6 flex-shrink-0 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
            />
            <span className="ml-2 text-sm font-medium text-gray-200 group-hover:text-gray-400">{cartCount}</span>
            <span className="sr-only">items in cart, view bag</span> */}

            <Image src='/images/shopping-cart.png' alt='shoppingCart Icon' width={30} height={30} />
              <span className="absolute -top-2 -right-2 bg-[#8B6D4D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
        </button>
        <Transition show={isCartSidebarVisible} as={Fragment}>
        <Dialog className="relative z-[9999]" onClose={()=>hideCartSidebarStatus()}>
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
                            <DialogTitle className="text-lg font-medium text-gray-900">Shopping cart</DialogTitle>
                            <div className="ml-3 flex h-7 items-center">
                            <button
                                type="button"
                                className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                onClick={()=>hideCartSidebarStatus()}
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                                {Array.isArray(cartItems) &&  cartItems.map((product ,idx) => (
                                <li key={idx} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <Image
                                        src={`${product.img}`}
                                        alt={`${product.name}`}
                                        width={500}
                                        height={400}
                                        className="h-full w-full object-cover object-center"
                                        style={{
                                            width: '100%',
                                            height : '100%'
                                        }}
                                        placeholder = 'empty'
                                        priority={true}
                                    />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                            <a href={`/product/${slugify(product.name)}`}>{product.name}</a>
                                        </h3>
                                        <p className="ml-4">₹{product.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                        <div>
                                        
                                
                                        <p className="text-gray-500">Qty {product.qnt}</p>

                                        </div>
                                    
                                        <div className="flex">
                                        <button
                                            type="button"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                            // onClick={()=>RemoveCartIteam(product.id , product.selectedAttributes)}
                                        >
                                           <TrashIcon className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                        </div>
                                    </div>
                                    </div>
                                </li>
                                ))}
                            </ul>
                            </div>
                        </div>
                        </div>

                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Subtotal</p>
                            <p>₹{subTotal }</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                            <button
                            href="/cart"
                            className="flex items-center justify-center rounded-md w-full  border border-transparent bg-gray-800 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700"
                            onClick={() => {
                                hideCartSidebarStatus();
                                router.push('/cart')
                            }}
                            >
                            Checkout
                            </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                            <p>
                            or{' '}
                            <a
                                href="/shop"
                                className="font-medium text-gray-800 hover:text-gray-800"
                                
                            >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                            </a>
                            </p>
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