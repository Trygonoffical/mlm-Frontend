"use client"
import { Fragment, useState , useContext, useEffect} from 'react'
import { Dialog,DialogPanel, DialogTitle,Transition ,TransitionChild } from '@headlessui/react'
import { XMarkIcon, ShoppingCartIcon , ShoppingBagIcon, TrashIcon} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';


const CreateCat = ({data = false , cats=[] , setRefreshKey}) => {

    const [isSidebarVisible , setisSidebarVisible]  = useState(false)
    const [categories, setCategories] = useState(cats);
    const [parentCategories, setParentCategories] = useState(cats);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
        parent: '',
        is_active: true
    });
    const showSidebarStatus = () =>{
        setisSidebarVisible(true);
      }
    //   // hide CartSidebar 
      const hideSidebarStatus = ()=>{
        // console.log('vvvv')
        setisSidebarVisible(false);

      }

          // Create category
            const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);

                // Debug cookie access
                console.log('All cookies:', document.cookie);
                console.log('Token from js-cookie:', Cookies.get('token'));
                console.log('All cookies from js-cookie:', Cookies.get());
            
                const token = Cookies.get('token');
                if (!token) {
                    // Try alternate methods to get the token
                    const allCookies = document.cookie.split(';');
                    const tokenCookie = allCookies.find(cookie => cookie.trim().startsWith('token='));
                    if (tokenCookie) {
                        const token = tokenCookie.split('=')[1];
                        console.log('Found token through alternate method:', token);
                    }
                }

                const form = new FormData();
                Object.keys(formData).forEach(key => {
                    if (formData[key] !== null && formData[key] !== '') {
                        form.append(key, formData[key]);
                    }
                });

                try {
                    const token = Cookies.get('token');
                    console.log('token - ' , token)
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: form,
                    });

                    if (response.ok) {
                        toast.success('Category created successfully');
                        // fetchCategories();
                        setFormData({
                            name: '',
                            description: '',
                            image: null,
                            parent: '',
                            is_active: true
                        });
                        setRefreshKey(prev => prev + 1);
                        hideSidebarStatus();
                    } else {
                        toast.error('Error creating category');
                        console.log('error-' . error)
                    }
                } catch (error) {
                    toast.error('Error creating category');
                    console.log('error-' . error)
                } finally {
                    setLoading(false);
                }
            };


  return (
    <>
         <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"  onClick={()=>showSidebarStatus()}>
            New Category
        </button>
        <Transition show={isSidebarVisible} as={Fragment}>
        <Dialog className="relative z-[9999]" onClose={()=>hideSidebarStatus()}>
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
                            <DialogTitle className="text-lg font-medium text-gray-900">Create Categoies</DialogTitle>
                            <div className="ml-3 flex h-7 items-center">
                            <button
                                type="button"
                                className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                onClick={()=>hideSidebarStatus()}
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flow-root">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1">Parent Category</label>
                                    <select
                                        value={formData.parent}
                                        onChange={(e) => setFormData({...formData, parent: e.target.value})}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">None</option>
                                        {parentCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-1">Image</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                                        className="w-full p-2 border rounded"
                                        accept="image/*"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                        className="mr-2"
                                    />
                                    <label>Active</label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 ${loading ? 'opacity-50' : ''}`}
                                >
                                    {loading ? 'Creating...' : 'Create Category'}
                                </button>
                            </form>
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

export default CreateCat