"use client"

import { useEffect, useState } from "react"
import Location from "./Location";
import { TrashIcon } from "@heroicons/react/24/outline";
import fetchAPI from "@/utils/api";

export default function CustomerAddress() {
  const [userData , setUserData] = useState();
 
  const deleteaddress = async(id)=>{
    const storedToken = localStorage.getItem("token");
    const usertoken = JSON.parse(storedToken);

    console.log('usertoken  -', usertoken)
    console.log('address id -', id)
    try {
      const res = await fetchAPI(`/vi/profileudpate/location/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken.token}`,
        },
      })

      if(res.status === 'success') {
        console.log('res - update - ', res);
        const newUserInfo = res.userinfo;
        usertoken.location = newUserInfo;
        localStorage.setItem("token", JSON.stringify(usertoken));
        updateLocation()
      }
    } catch (error) {
      console.error('Error updating Locations:', error);
    }
  }
  const updateLocation = ()=>{
    const storedToken = localStorage.getItem("token");
    const usertoken = JSON.parse(storedToken);
    setUserData(usertoken)
  }
  useEffect(()=>{
    const storedToken = localStorage.getItem("token");
    const usertoken = JSON.parse(storedToken);
    console.log('Current user data - ', usertoken)
    setUserData(usertoken)
  },[])
  return (
    <>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900 mb-4">Default Address</h2>
          {userData && userData.location ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
               { userData.location.map((loc , idx)=>(
                <div key={idx} className=" border border-gray-200 p-3 rounded-sm">
                  <p className="text-xs">
                  {loc.Type} - {loc.Address1} {loc.Address2} {loc.City} {loc.State} {loc.PinCode}  {loc.Country} 
                  </p>  
                  {loc.Active && (
                    <h2 className="text-red-500 text-sm">
                        Default
                    </h2>
                  )}
                  <button onClick={()=>deleteaddress(loc.id)}>
                    <TrashIcon className="w-4 h-4 text-red-600" />
                  </button>
                </div>
               ))}
              
            </div>
          ) : (
            <p className="mt-1 text-sm leading-6 text-gray-600">
              No Location Found !!
          </p>
          )}
          {/* <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you share.
          </p> */}
        </div>

        {/* <div className="border-b border-gray-900/10 pb-6">
          

          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
           

            <div className="col-span-full">
              <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                Street address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="street-address"
                  id="street-address"
                  autoComplete="street-address"
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                State / Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <div className="flex justify-end pt-5">
        <Location updateLocation={updateLocation} />
      </div>
     
      {/* <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Update
        </button>
      </div> */}
    </>
  )
}
