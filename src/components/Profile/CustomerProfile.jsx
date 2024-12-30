"use client"
import fetchAPI from '@/utils/api';
import { useEffect, useState } from 'react'
import { toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserInfo } from '@/redux/slices/authSlice';

export default function CustomerProfile() {
  const [name , setName] = useState('')
  const [lname , setLName] = useState('')
  const [email , setEmail] = useState('')
  const [phone , setPhone] = useState('')
  const [gst , setGst] = useState('')
//   const dispatch = useDispatch();
//   const {
//     userInfo,
//     token,
//     } = useSelector((state) => state.auth); 
  
//   const updateProfile = async()=>{
//     try {
//       const response = await toast.promise(
//         fetchAPI('/vi/profileudpate', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ name, lname, email, gst }),
//         }),
//         {
//           pending: 'Updating, please wait...',
//           success: 'Profile have been successfully updated 👌',
//           error: 'Failed to update 🤯',
//         }
//       );

//       if (response.status === 'success') {
//         // console.log('res - update - ', response);
//         const newUserInfo = response.userinfo;
//         updatedata(newUserInfo)
//         dispatch(updateUserInfo(newUserInfo))
//       }
//     } catch (error) {
//       console.error('Error updating social links:', error);
//     }
//   }

  const updatedata = (data)=>{
    console.log('in the data update - ' , data)
    if(data){
      setName(data.firstName || 'Vikas ');
      setLName(data.lastName || 'Gupta');
      setEmail(data.email || 'info@trygon.in');
      setPhone(data.phone || '8851285655' ) ;
    }
  }

  
  useEffect(() => {
        updatedata();
  }, []);
  return (
    <>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you share.
          </p>
        </div>

        <div className="border-b border-gray-900/10 pb-6">
          {/* <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p> */}

          {/* <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"> */}
            <div className=" flex justify-between items-center">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                First Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first-name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  id="first-name"
                  autoComplete="given-name"
                   className="block w-full px-2  border-0 border-b-2 border-red-800 py-1.5 text-red-600  ring-1 ring-inset ring-white placeholder:text-white focus:outline-none text-sm"
                />
              </div>
            </div>
            <hr className='my-5' />
            <div className=" flex justify-between items-center">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                Last Name
              </label>
              <div className="mt-2">
              <input
                  type="text"
                  name="first-lname"
                  id="first-;name"
                  value={lname}
                  onChange={(e)=>setLName(e.target.value)}
                  autoComplete="given-lname"
                   className="block w-full px-2  border-0 border-b-2 border-red-800 py-1.5 text-red-600  ring-1 ring-inset ring-white placeholder:text-white focus:outline-none text-sm"
                />
              </div>
            </div>
            <hr className='my-5' />
            <div className=" flex justify-between items-center">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                Phone no
              </label>
              <div className="mt-2">
              <input
                  disabled
                  type="text"
                  name="first-lname"
                  id="first-;name"
                  value={phone}
                  autoComplete="given-lname"
                   className="block w-full px-2  border-0 border-b-2 border-red-800 py-1.5 text-red-600  ring-1 ring-inset ring-white placeholder:text-white focus:outline-none text-sm"
                />
              </div>
            </div>
            <hr className='my-5' />
            <div className=" flex justify-between items-center">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email Address
              </label>
              <div className="mt-2">
              <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  autoComplete="given-email"
                  className="block w-full px-2  border-0 border-b-2 border-red-800 py-1.5 text-red-600  ring-1 ring-inset ring-white placeholder:text-white focus:outline-none text-sm"
                />
              </div>
            </div>
            <hr className='my-5' />
            <div className=" flex justify-between items-center">
              <label htmlFor="gst" className="block text-sm font-medium leading-6 text-gray-900">
                GST(Optiional)
              </label>
              <div className="mt-2">
              <input
                  type="text"
                  name="gst"
                  id="gst"
                  value={gst}
                  onChange={(e)=>setGst(e.target.value)}
                  autoComplete="given-gst"
                  className="block w-full px-2  border-0 border-b-2 border-red-800 py-1.5 text-red-600  ring-1 ring-inset ring-white placeholder:text-white focus:outline-none text-sm"
                />
              </div>
            </div>
          {/* </div> */}
        </div>

      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        //  onClick={updateProfile}
        >
          Update
        </button>
      </div>
      </>
  )
}
